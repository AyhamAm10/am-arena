import { colors } from '@/src/theme/colors';
import React from "react";
import Svg, { Path } from "react-native-svg";

type Props = {
  size?: number;
  width?: number;
  height?: number;
  color?: string;
};

/** From `src/assets/channel-icon.svg` */
export function ChannelNavIcon({
  size = 25,
  width: w,
  height: h,
  color = colors.grey,
}: Props) {
  const width = w ?? size;
  const height = h ?? (size * 28) / 25;
  return (
    <Svg width={width} height={height} viewBox="0 0 25 28" fill="none">
      <Path
        d="M8.12111 22.75V20.8056H4.23223C3.6975 20.8056 3.23975 20.6152 2.85896 20.2344C2.47817 19.8536 2.28778 19.3958 2.28778 18.8611V7.19444C2.28778 6.65972 2.47817 6.20197 2.85896 5.82118C3.23975 5.44039 3.6975 5.25 4.23223 5.25H19.7878C20.3225 5.25 20.7803 5.44039 21.161 5.82118C21.5418 6.20197 21.7322 6.65972 21.7322 7.19444V18.8611C21.7322 19.3958 21.5418 19.8536 21.161 20.2344C20.7803 20.6152 20.3225 20.8056 19.7878 20.8056H15.8989V22.75H8.12111ZM4.23223 18.8611H19.7878V7.19444H4.23223V18.8611Z"
        fill={color}
      />
    </Svg>
  );
}
