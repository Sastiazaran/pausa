import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Palette, Radius, Spacing } from '@/theme/tokens';

type PanelProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  tone?: 'card' | 'blush' | 'sage';
};

export function Panel({ children, style, tone = 'card' }: PanelProps) {
  return <View style={[styles.base, tone === 'blush' ? styles.blush : tone === 'sage' ? styles.sage : styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    borderWidth: 1,
  },
  card: {
    backgroundColor: Palette.card,
    borderColor: Palette.line,
  },
  blush: {
    backgroundColor: Palette.blushSoft,
    borderColor: 'transparent',
  },
  sage: {
    backgroundColor: Palette.sageSoft,
    borderColor: 'transparent',
  },
});
