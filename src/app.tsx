import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./error-page";
import LandingPage from "./routes/LandingPage";
import SaasProject from "./routes/SaasProject";
import ImageGathererWrapper from "./routes/ImageGathererWrapper";
import { useState, useEffect } from "react";
import { ProjectProvider } from "./Providers/ProjectProvider";
import SpaceTrace from "./routes/SpaceTrace";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

//add new routes here
const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/Saas",
    element: (
      <ProjectProvider>
        <SaasProject />
      </ProjectProvider>
    ),
  },
  {
    path: "/ImageGatherer",
    element: (
      <ProjectProvider>
        <ImageGathererWrapper />
      </ProjectProvider>
    ),
  },
  {
    path: "/SpaceTrace",
    element: (
      <ProjectProvider>
        <SpaceTrace />
      </ProjectProvider>
    ),
  },
]);

const App = () => {
  return <RouterProvider router={router}>{}</RouterProvider>;
};

export default App;
