import React from "react";
import Svg, { Path } from "react-native-svg";
import { colors_V2 } from "@/src/theme/colors";

type Props = {
  size?: number;
  width?: number;
  height?: number;
  color?: string;
};

export function HomeNavIconV2({
  size = 18,
  width: w,
  height: h,
  color = colors_V2.skyBlue,
}: Props) {
  const width = w ?? size;
  const height = h ?? (size * 18) / 16;
  return (
    <Svg width={width} height={height} viewBox="0 0 16 18" fill="none">
      <Path
        d="M1.94363 15.549H4.85909V9.71814H10.69V15.549H13.6054V6.80268L7.77454 2.42951L1.94363 6.80268V15.549ZM0 17.4927V5.83087L7.77454 -3.8147e-05L15.5491 5.83087V17.4927H8.74636V11.6618H6.80272V17.4927H0Z"
        fill={color}
      />
    </Svg>
  );
}
