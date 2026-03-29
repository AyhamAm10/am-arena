import React from "react";
import Svg, { Path } from "react-native-svg";

type Props = {
  width?: number;
  height?: number;
  color?: string;
};

/** From `src/assets/comment.svg` */
export function ReelCommentIcon({
  width = 20,
  height = 20,
  color = "#FFFFFF",
}: Props) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Path
        d="M0 19.4445V1.94446C0 1.40973 0.190394 0.951981 0.571181 0.571194C0.951968 0.190407 1.40972 1.33514e-05 1.94444 1.33514e-05H17.5C18.0347 1.33514e-05 18.4925 0.190407 18.8733 0.571194C19.2541 0.951981 19.4444 1.40973 19.4444 1.94446V13.6111C19.4444 14.1458 19.2541 14.6036 18.8733 14.9844C18.4925 15.3652 18.0347 15.5556 17.5 15.5556H3.88889L0 19.4445ZM3.0625 13.6111H17.5V1.94446H1.94444V14.7049L3.0625 13.6111Z"
        fill={color}
      />
    </Svg>
  );
}
