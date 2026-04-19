import React from "react";
import Svg, { Path } from "react-native-svg";
import { colors_V2 } from "@/src/theme/colors";

type Props = {
  width?: number;
  height?: number;
  color?: string;
};

export function ChatIcon({
  width = 20,
  height = 20,
  color = colors_V2.lavender,
}: Props) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H6L2 24V6C2 4.9 2.9 4 4 4ZM4 6V17.17L5.17 16H20V6H4ZM7 9H17V11H7V9ZM7 13H14V15H7V13Z"
        fill={color}
      />
    </Svg>
  );
}
