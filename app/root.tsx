import type { LinksFunction } from "@remix-run/node";
import { LiveReload, Links, Outlet, Link, Scripts } from "@remix-run/react";
import { useState } from "react";

import styles from "./tailwind.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function App() {
  const [isAsideOpen, setIsAsideOpen] = useState(true);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>It's a vin vin situation</title>
        <Links />
      </head>
      <body>
        <Scripts />
        <>
          <main
            className="min-h-screen w-full bg-gray-100 text-gray-700"
            x-data="layout"
          >
            <header className="flex w-full items-center justify-between border-b-2 border-gray-200 bg-white p-2">
              <div
                onClick={() => setIsAsideOpen(!isAsideOpen)}
                className="flex items-center space-x-2"
              >
                <button type="button" className="text-3xl">
                  <i className="gg-menu">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 6C2 5.44772 2.44772 5 3 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H3C2.44772 7 2 6.55228 2 6Z"
                        fill="currentColor"
                      />
                      <path
                        d="M2 12.0322C2 11.4799 2.44772 11.0322 3 11.0322H21C21.5523 11.0322 22 11.4799 22 12.0322C22 12.5845 21.5523 13.0322 21 13.0322H3C2.44772 13.0322 2 12.5845 2 12.0322Z"
                        fill="currentColor"
                      />
                      <path
                        d="M3 17.0645C2.44772 17.0645 2 17.5122 2 18.0645C2 18.6167 2.44772 19.0645 3 19.0645H21C21.5523 19.0645 22 18.6167 22 18.0645C22 17.5122 21.5523 17.0645 21 17.0645H3Z"
                        fill="currentColor"
                      />
                    </svg>
                  </i>
                </button>
              </div>
              <div className="absolute right-2 mt-1 w-48 divide-y divide-gray-200 rounded-md border border-gray-200 bg-white shadow-md">
                <div className="p-2">
                  <button className="flex items-center space-x-2 transition hover:text-blue-600">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      ></path>
                    </svg>
                    <div>Log Out</div>
                  </button>
                </div>
              </div>
            </header>
            <div className="flex">
              {isAsideOpen && (
                <aside className="flex w-72 flex-col space-y-2 border-r-2 border-gray-200 bg-white p-2">
                  <Link
                    to="/reviews"
                    className="flex items-center space-x-1 rounded-md px-2 py-3 hover:bg-gray-100 hover:text-blue-600"
                  >
                    <span className="text-2xl">
                      <i className="bx bx-home"></i>
                    </span>
                    <span>Reviews</span>
                  </Link>

                  <Link
                    to="/review"
                    className="flex items-center space-x-1 rounded-md px-2 py-3 hover:bg-gray-100 hover:text-blue-600"
                  >
                    <span className="text-2xl">
                      <i className="bx bx-cart"></i>
                    </span>
                    <span>Review wine</span>
                  </Link>
                </aside>
              )}

              <div className="w-full p-4">
                <Outlet />
              </div>
            </div>
          </main>
        </>
        <LiveReload />
      </body>
    </html>
  );
}
