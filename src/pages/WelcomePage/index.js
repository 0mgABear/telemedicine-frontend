
import * as React from "react";
import StickyFooter from "../../common/StickyFooter";
import MainAppBar from "../../common/MainAppBar";
import { ChatGPT } from "./ChatGPT";

export default function WelcomePage() {
  return (
            <div>
      <header>
        <MainAppBar />
        <ChatGPT />
      </header>
      <StickyFooter></StickyFooter>
    </div>
  );
}