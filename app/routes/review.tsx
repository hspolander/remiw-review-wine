import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

type LoaderData = {
  countries: Array<{ country: string }>;
  colors: Array<{ categoryLevel2: string }>;
  searchParams?: {
    categoryLevel2?: string[];
    country?: string[];
    name?: string;
  }
};

export const loader: LoaderFunction = async ({ request }) => {
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
  
  //Lägg till grapes
  //Lägg till smakklockor

  const url = new URL(request.url);
  const categoryLevel2 = url.searchParams.getAll("categoryLevel2") || [];
  const country = url.searchParams.getAll("country") || [];
  const name = url.searchParams.get("name") || "";

  const data: LoaderData = {
    countries,
    colors,
    searchParams: {
      categoryLevel2,
      country,
      name,
    }
  };

  return json(data);
};

export default function ReviewRoute() {
  const loaderData = useLoaderData<LoaderData>();
  return (
    <div className="flex flex-column bg-white dark:bg-gray-900">
      <div className="basis-1/4 mr-6">
        <Form method="get">
          <div>
            <h1 className="text-3xl">Filter</h1>
            <div className="w-full max-w-xs">
              <label className="label">
                <span className="label-text">Name</span>
                <input type="text" name="name" className="input input-bordered w-full max-w-xs" defaultValue={loaderData.searchParams?.name} placeholder="21 Gables" />
              </label>
            </div>
          </div>
          <div className="divider"></div> 
          <div>
            <h1 className="text-xl">Country</h1>
            {loaderData.countries.map(({ country }) => (
              <div key={country}>
                <label className="label cursor-pointer">
                  <span className="label-text">{country}</span> 
                  <input name="country" value={country} key={country} type="checkbox" defaultChecked={loaderData.searchParams?.country?.some((urlParamCountry) => urlParamCountry === country)}  className="checkbox" />
                </label>
              </div>
            ))}
          </div>
          <div className="divider"></div> 
          <div>
            <h1 className="text-xl">Type</h1>
            {loaderData.colors.map(({ categoryLevel2 }) => (
              <div key={categoryLevel2}>
                <label className="label cursor-pointer">
                  <span className="label-text">{categoryLevel2}</span> 
                  <input name="categoryLevel2" value={categoryLevel2} key={categoryLevel2} defaultChecked={loaderData.searchParams?.categoryLevel2?.some((urlParamCategoryLevel2) => urlParamCategoryLevel2 === categoryLevel2)} type="checkbox" className="checkbox" />
                </label>
              </div>
            ))}
          </div>
          <div className="divider"></div>
          <div>
            <button
              type="submit"
              className="btn"
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
