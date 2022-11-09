import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import natsort from 'natsort'
import { prisma } from "@prisma/client";


type LoaderData = {
  countriesWithCount: { country: string, count: number }[];
  colorsWithCount: { categoryLevel2: string, count: number }[];
  searchParams?: {
    categoryLevel2?: string[];
    country?: string[];
    name?: string;
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  var sorter = natsort();

  const url = new URL(request.url);
  const categoryLevel2 = url.searchParams.getAll("categoryLevel2") || [];
  const country = url.searchParams.getAll("country") || [];
  const name = url.searchParams.get("name") || "";

  const countries = await db.systembolagetWine.findMany({
    select: { country: true },
    distinct: ["country"],
    orderBy: { country: "asc" },
  });

  const colors = await db.systembolagetWine.findMany({
    select: { categoryLevel2: true,},
    distinct: ["categoryLevel2"],
    orderBy: { categoryLevel2: "asc" },
  });

  const colorsByParams = await db.systembolagetWine.groupBy({
    by: ['categoryLevel2'],
    where: {
      AND: [
        { ...(categoryLevel2?.length > 0
          ? { categoryLevel2: { in: categoryLevel2 } }
          : {}
        )},
        { ...(country?.length > 0
          ? { country: { in: country } }
          : {}
        )},
        {
          OR: [
            { productNameBold: { contains: name } },
            { productNameThin: { contains: name } },
          ],
        },
      ],
    },
    _count: {
      categoryLevel2: true,
    },
    orderBy: {
      _count: {
        categoryLevel2: 'desc',
      },
    },  
  });

  const countriesByParams = await db.systembolagetWine.groupBy({
    by: ['country'],
    where: {
      AND: [
        { ...(categoryLevel2?.length > 0
          ? { categoryLevel2: { in: categoryLevel2 } }
          : {}
          )},
          { ...(country?.length > 0
            ? { country: { in: country } }
        : {}
        )},
        {
          OR: [
            { productNameBold: { contains: name } },
            { productNameThin: { contains: name } },
          ],
        },
      ],
    },
    _count: {
      country: true,
    },
    orderBy: {
      _count: {
        country: 'desc',
      },
    },  
  });

  const countriesWithCount = countries.map(({country}) => {
    const count = countriesByParams.find((item) => item.country === country ? item._count.country : 0)
    return { country, count: count?._count.country ?? 0}
  }).sort((a, b) => sorter(b.count, a.count))
  const colorsWithCount = colors.map(({categoryLevel2}) => {
    const count = colorsByParams.find((item) => item.categoryLevel2 === categoryLevel2 ? item._count.categoryLevel2 : 0)
    return { categoryLevel2, count: count?._count.categoryLevel2 ?? 0}
  }).sort((a, b) => sorter(b.count, a.count))
  const data: LoaderData = {
    colorsWithCount,
    countriesWithCount,
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
              </label>
                <input type="text" name="name" className="input input-bordered w-full max-w-xs" defaultValue={loaderData.searchParams?.name} placeholder="21 Gables" />
            </div>
          </div>
          <div className="divider"></div> 
          <div>
            <h1 className="text-xl">Country</h1>
            {loaderData.countriesWithCount.map(({ country, count }) => (
              <div key={country}>
                <label className="label cursor-pointer">
                <span className="label-text">{country}</span><div className="w-full text-right text-slate-400 pr-2">{count}</div>
                  <input name="country" value={country} key={country} type="checkbox" defaultChecked={loaderData.searchParams?.country?.some((urlParamCountry) => urlParamCountry === country)}  className="checkbox" />
                </label>
              </div>
            ))}
          </div>
          <div className="divider"></div> 
          <div>
            <h1 className="text-xl">Type</h1>
            {loaderData.colorsWithCount.map(({ categoryLevel2, count }) => (
              <div key={categoryLevel2}>
                <label className="label cursor-pointer">
                  <span className="label-text">{categoryLevel2}</span><div className="w-full text-right text-slate-400 pr-2">{count}</div>
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
