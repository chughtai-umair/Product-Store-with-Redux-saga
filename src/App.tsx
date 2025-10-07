import React from "react";
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Login from "./components/login";
import MainLayout from "./layouts/MainLayout";

const App: React.FC = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        {/*  auth section */}
        {/* <Route path="login" element={<Login />} /> */}
        {/* Admin panel */}
        <Route index element={<MainLayout />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
