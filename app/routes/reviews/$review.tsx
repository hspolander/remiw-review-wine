import type { Review, SystembolagetWine, Wine } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import type { SerializedStateDates } from "types/generic";
import { db } from "~/utils/db.server";
import whiteGlass from "~/images/white-glass.jpg";
import redGlass from "~/images/red-glass.jpg";
import roseGlass from "~/images/rose-glass.png";

type LoaderData = SerializedStateDates<Review> & {
  wine: SerializedStateDates<Wine> & {
    sysWine: SerializedStateDates<SystembolagetWine> | null;
  };
  reviewer: {
    name: string;
  };
};
export let loader: LoaderFunction = async ({ params }) => {
  const review = await db.review.findUnique({
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
  return review;
};

export default function UserReview() {
  const review = useLoaderData<LoaderData>();

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
  const image = review.wine.sysWine?.image || getwineImage(review.wine.color);

  return (
    <div className="relative max-w-md mx-auto xl:max-w-2xl min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl mt-16">
      <div className="card">
        <div className="card-body">
          <Link to="#">
            <h4 className="font-semibold">{review.wine.name}</h4>
          </Link>
          <p className="opcacity-60 mb-4">{review.comment}</p>
        </div>
        <div className="card-header mx-4 -mt-6">
          <img className=" rounded-lg" src={image} alt="tailwind-card" />
        </div>
      </div>
    </div>
  );
}
