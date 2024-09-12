import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./app";

import "../src/css/newGlobal.css";
import "../src/css/animations.css";
import { ProjectProvider } from "./Providers/ProjectProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="mainContainer">
      <div className="backgroundContainer">
        <div className="backgroundAnimation">
          <Toaster />
          <ProjectProvider>
            <App />
          </ProjectProvider>
        </div>
      </div>
    </div>
  </StrictMode>
);
