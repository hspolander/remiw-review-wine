import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import whiteGlass from "~/images/white-glass.jpg";
import redGlass from "~/images/red-glass.jpg";
import roseGlass from "~/images/rose-glass.png";

import type { Review, SystembolagetWine, Wine } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import type { SerializedStateDates } from "types/generic";

type LoaderData = (SerializedStateDates<Review> & {
  wine: SerializedStateDates<Wine> & {
    sysWine: SerializedStateDates<SystembolagetWine> | null;
  };
  reviewer: {
    name: string;
  };
})[];

export const loader: LoaderFunction = async () => {
  const reviews = await db.review.findMany({
    include: {
      wine: {
        include: {
          sysWine: true,
        },
      },
      reviewer: {
        select: { name: true },
      },
    },
  });

  return json(reviews);
};

export default function ReviewsRoute() {
  const getwineImage = (color: string | null) => {
    console.log(color);
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

  const loaderData: LoaderData = useLoaderData();
  return (
    <>
      <div>
        <h1>reviews</h1>
        <div>
          <section className="bg-white dark:bg-gray-900">
            <div className="container px-6 py-8 mx-auto">
              <div className="lg:flex lg:-mx-2"></div>
              <div className="mt-6 lg:mt-0 lg:px-2 lg:w-4/5 ">
                <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {loaderData.map((review) => {
                    const image =
                      review.wine.sysWine?.image ||
                      getwineImage(review.wine.color);

                    return (
                      <Link key={review.id} prefetch="intent" to={review.id}>
                        <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto">
                          <div className="w-full text-right">
                            <span className="inline-block text-center w-11 h-10 text-pink-800 bold font-bold text-2xl rounded-full border-solid border-4 border-sky-800">
                              {review.score}
                            </span>
                          </div>
                          <img
                            className="object-cover h-full rounded-md xl:h-80"
                            src={image}
                            alt=""
                          />
                          <h4 className="mt-2 text-lg font-medium text-gray-700 dark:text-gray-200">
                            {review.wine.name}
                          </h4>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </>
  );
}
