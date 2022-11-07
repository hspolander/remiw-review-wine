import type { Review, SystembolagetWine, Wine } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
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
    <div className="relative max-w-xs min-w-0 bg-white mb-6 border-2 border-slate-400 rounded-xl mt-16">
      <div className="card  mx-8">
        <div className="card-image mx-4 mb-6 ">
          <div className="z-10 text-right relative mt-4 -mr-4">
            <span className="font-bold p-2 text-2xl tracking-tighter rounded-full border-yellow-300 border-4">
              {review.score} / 10
            </span>
          </div>
          <img
            className="max-h-96 -mt-8 rounded-lg z-0"
            src={image}
            alt="tailwind-card"
          />
        </div>
        <div className="card-body">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={review.wine.url || "#"}
          >
            <h4 className="font-semibold">{review.wine.name}</h4>
          </a>
          <p className="opacity-80 mb-2">{review.comment}</p>
          <p className="opacity-80 mb-4">
            Recenserat av {review.reviewer.name}
          </p>
        </div>
      </div>
    </div>
  );
}
