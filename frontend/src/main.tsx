import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./app";

import "../src/css/newGlobal.css";
import "../src/css/animations.css";

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
