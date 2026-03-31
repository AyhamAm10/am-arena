import React from "react";
import { Api } from "./api";
import { State } from "./state";
import { Ui } from "./ui";
import type { ProfileVariant } from "./store/api";
import { Utils } from "./utils";

export type ProfileFactoryProps = {
  variant: ProfileVariant;
  userId?: string;
};

export function Factory({ variant, userId }: ProfileFactoryProps) {
  return (
    <Api variant={variant} userId={userId}>
      <Utils>
        <State>
          <Ui />
        </State>
      </Utils>
    </Api>
  );
}
