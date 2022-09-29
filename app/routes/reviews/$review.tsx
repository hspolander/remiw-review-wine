import type { Review } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

type LoaderData = { review: Review };

export let loader: LoaderFunction = async ({ params }) => {
  let review = await db.review.findUnique({
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
    where: { id: params.review },
  });
  if (!review) {
    throw new Response("Not found.", {
      status: 404,
    });
  }
  let data: LoaderData = { review };
  return data;
};

export default function UserReview() {
  const data = useLoaderData<LoaderData>();

  return <div>{data.review.comment}</div>;
}
