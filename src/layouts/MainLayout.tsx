import Navbar from "../components/Navbar";
import { Outlet } from "react-router";
import { Main } from "../pages/Main";

export default function MainLayout() {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Main />
    </div>
  );
}
