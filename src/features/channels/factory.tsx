import React from "react";
import { Api } from "./api";
import { State } from "./state";
import { Ui } from "./ui";

export function Factory() {
  return (
    <Api>
      <State>
        <Ui />
      </State>
    </Api>
  );
}
