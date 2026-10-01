import type { ReactNode } from 'react';
import { Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { FontFamily, FontSize, Palette } from '@/theme/tokens';

type Variant = 'hero' | 'title' | 'heading' | 'body' | 'soft' | 'label' | 'money' | 'moneyLight';

const VariantStyle: Record<Variant, TextStyle> = {
  hero: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.hero,
    color: Palette.ink,
    letterSpacing: -0.8,
  },
  title: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.title,
    color: Palette.ink,
    letterSpacing: -0.4,
  },
  heading: {
    fontFamily: FontFamily.displayMedium,
    fontSize: FontSize.heading,
    color: Palette.ink,
  },
  body: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Palette.ink,
    lineHeight: 22,
  },
  soft: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Palette.inkSoft,
    lineHeight: 20,
  },
  label: {
    fontFamily: FontFamily.bodySemi,
    fontSize: FontSize.micro,
    color: Palette.inkSoft,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  money: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.hero,
    color: Palette.ink,
    fontVariant: ['tabular-nums'],
  },
  moneyLight: {
    fontFamily: FontFamily.display,
    fontSize: 34,
    color: Palette.onInk,
    fontVariant: ['tabular-nums'],
  },
};

type TxtProps = TextProps & {
  variant?: Variant;
  children: ReactNode;
  style?: StyleProp<TextStyle>;
};

export function Txt({ variant = 'body', style, children, ...rest }: TxtProps) {
  return (
    <Text {...rest} style={[VariantStyle[variant], style]}>
      {children}
    </Text>
  );
}
