import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { AdminApp } from "./admin/AdminApp";

const el = document.getElementById("admin-root");
if (el) {
  createRoot(el).render(
    <StrictMode>
      <AdminApp />
    </StrictMode>,
  );
}
