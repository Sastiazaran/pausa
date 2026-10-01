import type { ReactNode } from 'react';
import { Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { FontFamily, Palette, Radius, Spacing } from '@/theme/tokens';

import { Txt } from './text';

type Tone = 'primary' | 'quiet' | 'ink';

type ButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  tone?: Tone;
  style?: StyleProp<ViewStyle>;
};

export function Button({ label, tone = 'primary', disabled, style, ...rest }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        tone === 'primary' ? styles.primary : tone === 'ink' ? styles.ink : styles.quiet,
        disabled ? styles.disabled : null,
        pressed && !disabled ? styles.pressed : null,
        style,
      ]}
      {...rest}>
      <Txt
        variant="body"
        style={[styles.label, tone === 'primary' || tone === 'ink' ? styles.labelOn : styles.labelQuiet]}>
        {label}
      </Txt>
    </Pressable>
  );
}

export function IconButton({ children, onPress }: { children: ReactNode; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} hitSlop={8} style={styles.icon}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  primary: {
    backgroundColor: Palette.blush,
  },
  ink: {
    backgroundColor: Palette.ink,
  },
  quiet: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Palette.line,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.82,
  },
  label: {
    fontFamily: FontFamily.bodyBold,
  },
  labelOn: {
    color: Palette.onInk,
  },
  labelQuiet: {
    color: Palette.ink,
  },
  icon: {
    padding: Spacing.xs,
  },
});
