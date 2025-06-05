import * as React from 'react';
import Svg, { Text, G, Defs, Mask, Rect, Circle, Path } from 'react-native-svg';

interface LogoProps {
  width?: number | string;
  height?: number | string;
  style?: any;
}

const Logo = (props: LogoProps) => (
  <Svg viewBox="0 0 170 52" {...props}>
    {/* @ts-ignore */}
    <Defs>
      <Mask id="pinMaskLight">
        <Rect x={-50} y={-70} width={100} height={120} fill="white" />
        <Circle cx={0} cy={-25} r={25} fill="black" />
      </Mask>
    </Defs>

    <Text
      x={0}
      y={48}
      fontFamily="Arial, sans-serif"
      fontSize={60}
      fontWeight="bold"
      fill="#374151"
    >
      n
    </Text>

    <G transform="translate(53, 30) scale(0.45)">
      <Path
        d="M 0 40 Q -35 5 -35 -25 Q -35 -60 0 -60 Q 35 -60 35 -25 Q 35 5 0 40 Z"
        fill="#6366f1"
        mask="url(#pinMaskLight)"
      />
      <Text
        x={0}
        y={-20}
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize={16}
        fontWeight="bold"
        fill="#374151"
      >
        nook
      </Text>
    </G>

    <Text
      x={70}
      y={48}
      fontFamily="Arial, sans-serif"
      fontSize={60}
      fontWeight="bold"
      fill="#374151"
    >
      oks
    </Text>
  </Svg>
);

export default Logo;
