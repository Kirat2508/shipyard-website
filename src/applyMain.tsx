import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ApplyApp } from "./apply/ApplyApp";

const el = document.getElementById("apply-root");
if (el) {
  createRoot(el).render(
    <StrictMode>
      <ApplyApp />
    </StrictMode>,
  );
}
