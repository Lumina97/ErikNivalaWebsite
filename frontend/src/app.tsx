import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./error-page";
import About from "./routes/About";
import Home from "./routes/Home";
import Website from "./routes/Website";
import SpaceTrace from "./routes/SpaceTrace";
import Saas from "./routes/Saas";
import SaasProject from "./routes/SaasProject";
import ImageGatherer from "./routes/ImageGatherer";

//add new routes here
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/website",
    element: <Website />,
  },
  {
    path: "/Saas",
    element: <Saas />,
  },
  {
    path: "/SaasProject",
    element: <SaasProject />,
  },
  {
    path: "/ImageGatherer",
    element: <ImageGatherer />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/SpaceTrace",
    element: <SpaceTrace />,
  },
]);

const App = () => {
  return <RouterProvider router={router}>{}</RouterProvider>;
};

export default App;
