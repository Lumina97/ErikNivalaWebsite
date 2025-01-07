import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./app";

import "../src/css/global.css";
import "../src/css/animations.css";
import "../src/css/responsive.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="mainContainer">
      <div className="backgroundContainer">
        <div className="backgroundAnimation">
          <Toaster />
          <App />
        </div>
      </div>
    </div>
  </StrictMode>
);
