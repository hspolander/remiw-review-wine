import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import whiteGlass from "~/images/white-glass.jpg";
import redGlass from "~/images/red-glass.jpg";
import roseGlass from "~/images/rose-glass.png";

type LoaderData = {
  countries: Array<{ country: string }>;
  colors: Array<{ categoryLevel2: string }>;
};

export const loader: LoaderFunction = async () => {
  const countries = await db.systembolagetWine.findMany({
    select: { country: true },
    distinct: ["country"],
    orderBy: { country: "asc" },
  });
  const colors = await db.systembolagetWine.findMany({
    select: { categoryLevel2: true },
    distinct: ["categoryLevel2"],
    orderBy: { categoryLevel2: "asc" },
  });

  const data: LoaderData = {
    countries,
    colors,
  };

  return json(data);
};

export default function ReviewRoute() {
  const loaderData = useLoaderData<LoaderData>();
  return (
    <div className="flex flex-column bg-white dark:bg-gray-900">
      <div className="basis-1/4">
        <Form method="get">
          <div>
            <h1 className="text-3xl">Filter</h1>
            <label>
              Name: <input type="text" name="name" />
            </label>
          </div>
          <div>
            <label>
              Country:{" "}
              <select name="country" id="country-select">
                <option key="" value="">
                  Select:
                </option>
                {loaderData.countries.map(({ country }) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <label>
              Color:{" "}
              <select name="categoryLevel2" id="color-select">
                <option key="" value="">
                  Select:
                </option>
                {loaderData.colors.map(({ categoryLevel2 }) => (
                  <option key={categoryLevel2} value={categoryLevel2}>
                    {categoryLevel2}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <button
              type="submit"
              className="p-3 text-xl rounded-md border-solid border-4 border-sky-800 bg-lime-200"
            >
              Filter results
            </button>
          </div>
        </Form>
      </div>
      <div className="basis-3/4">
        <Outlet />
      </div>
    </div>
  );
}
