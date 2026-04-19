import React from "react";
import { Api } from "./api";
/** Ensures Arabic copy module is bundled (Metro entry for strings). */
import "@/src/features/tournaments/strings";
import { Ui } from "./ui";
import { Utils } from "./utils";

export function Factory() {
  return (
    <Api>
      <Utils>
        <Ui />
      </Utils>
    </Api>
  );
}
