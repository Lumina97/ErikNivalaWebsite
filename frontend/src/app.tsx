import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./error-page";
import LandingPage from "./routes/LandingPage";

//add new routes here
const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
]);

const App = () => {
  return <RouterProvider router={router}>{}</RouterProvider>;
};

export default App;
