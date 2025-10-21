import React from "react";
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
// import Login from "./components/login";
import MainLayout from "./layouts/MainLayout";
import Precticelayout from "./layouts/precticelayout";
import { AddProduct } from "./pages/product/AddProduct";
import { Practice } from "./pages/practice grid/practice";
import { HomeScreen } from "./pages/practice grid/HomeScreen";
import { ProductList } from "./pages/practice grid/ProductList";

const App: React.FC = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        {/*  auth section */}
        {/* <Route path="login" element={<Login />} /> */}

        {/* Admin panel */}
        <Route element={<MainLayout />}>
          <Route path="add-product" element={<AddProduct />} />
        </Route>
        {/* Practice section */}
        <Route path="practicelayout" element={<Precticelayout />}>
          <Route index element={<HomeScreen />} />
          <Route path="practice" element={<Practice />} />
          <Route path="practice-list" element={<ProductList />} />
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
