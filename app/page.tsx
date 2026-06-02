"use client";

import Main from "./Main";
import { Scrollable } from "@/components/Scrollable";

export default function Page() {
  return (
    <Scrollable defer x y>
      <Main />
    </Scrollable>
  );
}