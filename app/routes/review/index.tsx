import type { SystembolagetWine } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import whiteGlass from "~/images/white-glass.jpg";
import redGlass from "~/images/red-glass.jpg";
import roseGlass from "~/images/rose-glass.png";

type LoaderData = SystembolagetWine[];
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const categoryLevel2 = url.searchParams.get("categoryLevel2") || "";
  const country = url.searchParams.get("country") || "";
  const name = url.searchParams.get("name") || "";

  const systembolagetWines = await db.systembolagetWine.findMany({
    where: {
      AND: [
        { categoryLevel2: { contains: categoryLevel2 } },
        { country: { contains: country } },
        {
          OR: [
            { productNameBold: { contains: name } },
            { productNameThin: { contains: name } },
          ],
        },
      ],
    },
  });
  return json(systembolagetWines);
};

export default function ReviewIndexRoute() {
  const getwineImage = (color: string | null) => {
    switch (color) {
      case "Rött":
        return redGlass;
      case "Vitt":
        return whiteGlass;
      case "Rosévin":
        return roseGlass;
      default:
        return whiteGlass;
    }
  };

  const getHeader = (productNameBold, productNameThin) => {
    const name1 = productNameBold && productNameBold.trim();
    const name2 = productNameThin ? `, ${productNameThin}` : "";
    return name1 + name2;
  };

  const getSubHeader = (categoryLevel2, categoryLevel3, vintage) => {
    const type = categoryLevel2 ?? "";
    const subType = categoryLevel3 ? `, ${categoryLevel3}` : "";
    const year = vintage ? `, ${vintage}` : "";
    return type + subType + year;
  };

  const loaderData = useLoaderData<LoaderData>();

  return (
    <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {loaderData.map((sysWine) => {
        const {
          productId,
          productNameThin,
          productNameBold,
          color,
          vintage,
          country,
          volume,
          categoryLevel2,
          categoryLevel3,
        } = sysWine;
        const image = sysWine?.image || getwineImage(color);
        return (
          <div
            key={`/add/${productId}`}
            className="relative max-w-md min-w-0 bg-white mb-6"
          >
            <Link prefetch="intent" to={productId}>
              <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto">
                <img
                  className="object-cover h-full rounded-md xl:h-96"
                  src={image}
                  alt=""
                />
                <div className="w-full absolute bg-black/70 bottom-0 left-0 border-2 rounded-lg p-3">
                  <div className="text-lg font-medium text-white overflow-hidden">
                    {getHeader(productNameBold, productNameThin)}
                  </div>
                  <div className="text-lg font-light text-white overflow-hidden">
                    {getSubHeader(categoryLevel2, categoryLevel3, vintage)}
                  </div>
                  <div className="text-lg font-light text-white overflow-hidden">
                    {country}, {volume}ml
                  </div>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
