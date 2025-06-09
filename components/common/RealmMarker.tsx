import React, { memo } from 'react';
import { View } from 'react-native';
import Svg, { G, Path, Circle, Text } from 'react-native-svg';

interface RealmMarkerProps {
  size?: number;
}

const RealmMarker: React.FC<RealmMarkerProps> = memo(({ size = 32 }) => {
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg width={size} height={size} viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
        <G transform="translate(100, 100)">
          <Path
            d="M 0 40 Q -35 5 -35 -25 Q -35 -60 0 -60 Q 35 -60 35 -25 Q 35 5 0 40 Z"
            fill="#6366f1"
          />

          <Circle cx="0" cy="-25" r="25" fill="#ffffff" />

          <Text
            x="0"
            y="-18"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontSize="16"
            fontWeight="bold"
            fill="#6366f1"
          >
            realm
          </Text>
        </G>
      </Svg>
    </View>
  );
});

RealmMarker.displayName = 'RealmMarker';

export default RealmMarker;
