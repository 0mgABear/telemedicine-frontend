import { Outlet } from "react-router-dom";
import MainAppBar from "../../common/MainAppBar";
import StickyFooter from "../../common/StickyFooter";

export default function WrapperPage() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <MainAppBar />
      <Outlet />
      <StickyFooter></StickyFooter>
    </div>
  );
}
