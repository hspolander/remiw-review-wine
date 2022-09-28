import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

import type { Review, Wine } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import type { SerializedStateDates } from "types/generic";

type LoaderData = (SerializedStateDates<Review> & {
  wine: SerializedStateDates<Wine>;
  reviewer: {
    name: string;
  };
})[];

export const loader: LoaderFunction = async () => {
  const reviews = await db.review.findMany({
    include: {
      wine: true,
      reviewer: {
        select: { name: true },
      },
    },
  });

  return json(reviews);
};

export default function ReviewsIndexroute() {
  const loaderData: LoaderData = useLoaderData();
  console.log({ loaderData });
  return (
    <div>
      <p>reviews</p>
      <ul>
        {loaderData.map((review) => (
          <li key={review.id}>
            {review.wine.name} {review.score}
          </li>
        ))}
      </ul>
    </div>
  );
}
