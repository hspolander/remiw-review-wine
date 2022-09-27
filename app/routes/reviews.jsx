import { Outlet } from "@remix-run/react";

export default function ReviewsRoute() {
  return (
    <div>
      <h1>reviews</h1>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
