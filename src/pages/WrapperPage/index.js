import { Outlet } from "react-router-dom";
import MainAppBar from "../../common/MainAppBar";
import StickyFooter from "../../common/StickyFooter";

export default function WrapperPage(){
  return (
    <div>
      <MainAppBar />
      <Outlet />
      <StickyFooter></StickyFooter>
    </div>
  );
}