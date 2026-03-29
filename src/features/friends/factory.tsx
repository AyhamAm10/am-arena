import React from "react";
import { Api } from "./api";
import { State } from "./state";
import { Utils } from "./utils";
import { Ui } from "./ui";

export function Factory() {
  return (
    <State>
      <Api>
        <Utils>
          <Ui />
        </Utils>
      </Api>
    </State>
  );
}
