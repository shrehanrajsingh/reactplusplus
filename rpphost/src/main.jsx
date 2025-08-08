import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./__app_gen.jsx";

document.addEventListener("submit", function (event) {
  const form = event.target;
  if (
    form.tagName.toLowerCase() === "form" &&
    form.method.toLowerCase() === "post"
  ) {
    if (!form.action || form.action === window.location.href) {
      form.action = "/api";
    }
  }
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
