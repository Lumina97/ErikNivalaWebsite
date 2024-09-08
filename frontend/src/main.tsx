import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import { MainContainerProvider } from "./Providers/MainContainerProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MainContainerProvider>
      <App />
    </MainContainerProvider>
  </StrictMode>
);
