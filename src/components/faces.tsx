import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

import type { SatisfactionLevel } from '@/domain/constants';
import { Palette } from '@/theme/tokens';

const Mouth: Record<SatisfactionLevel, string> = {
  1: 'M16 34 Q24 26 32 34',
  2: 'M16 32 Q24 29 32 32',
  3: 'M16 31 H32',
  4: 'M16 29 Q24 36 32 29',
  5: 'M15 27 Q24 39 33 27',
};

type FaceProps = {
  mood: SatisfactionLevel;
  selected?: boolean;
  size?: number;
};

/** Cara dibujada. El estado de ánimo es del gasto, no un hábito. */
export function Face({ mood, selected = false, size = 56 }: FaceProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Circle
        cx="24"
        cy="24"
        r="21.5"
        fill={selected ? Palette.blushSoft : Palette.card}
        stroke={selected ? Palette.blush : Palette.ink}
        strokeWidth={1.6}
      />
      <Circle cx="17.5" cy="20" r="1.7" fill={Palette.ink} />
      <Circle cx="30.5" cy="20" r="1.7" fill={Palette.ink} />
      {mood >= 4 ? <Ellipse cx="13" cy="25" rx="2.4" ry="1.5" fill={Palette.blush} opacity={0.85} /> : null}
      {mood >= 4 ? <Ellipse cx="35" cy="25" rx="2.4" ry="1.5" fill={Palette.blush} opacity={0.85} /> : null}
      <Path d={Mouth[mood]} stroke={Palette.ink} strokeWidth={1.8} fill="none" strokeLinecap="round" />
    </Svg>
  );
}
