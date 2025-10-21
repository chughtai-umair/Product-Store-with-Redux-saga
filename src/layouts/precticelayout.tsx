import React from "react";
import { Outlet } from "react-router-dom";
import PrecticeNavbar from "../components/PrecticeNavbar";

export default function Precticelayout() {
  return (
    <div>
      <PrecticeNavbar />
      <Outlet />
    </div>
  );
}
