import React from "react";
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
// import Login from "./components/login";
import MainLayout from "./layouts/MainLayout";
import { AddProduct } from "./pages/product/AddProduct";
import { Practice } from "./pages/practice grid/practice";
import { ProductList } from "./pages/practice grid/ProductList";

const App: React.FC = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        {/*  auth section */}
        {/* <Route path="login" element={<Login />} /> */}
        {/* Admin panel */}
        <Route index element={<MainLayout />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="practice" element={<Practice />} />
        <Route path="product-list" element={<ProductList />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
