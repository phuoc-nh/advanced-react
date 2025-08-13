import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { startKeepAlive } from "./lib/utils/keep-alive";

// Start keep-alive service to prevent Render free tier spin-down
startKeepAlive();

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
}
