import React from "react";
import { Api } from "./api";
import { Utils } from "./utils";
import { State } from "./state";
import { Ui } from "./ui";
  

export function Factory() {
  return (
    <Api>
      <Utils>
        <State>
          <Ui />
        </State>
      </Utils>
    </Api>
  );
}
