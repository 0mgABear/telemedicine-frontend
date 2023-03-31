import MainAppBar from "../../common/MainAppBar";
import StickyFooter from "../../common/StickyFooter";

export default function DashboardPage() {
  return <div>
      <header>
        <MainAppBar />
        <div>You are logged in</div>
      </header>
      <StickyFooter></StickyFooter>
    </div>
    ;
}
