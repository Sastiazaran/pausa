import { Pressable, StyleSheet } from 'react-native';

import { FontFamily, Palette, Radius, Spacing } from '@/theme/tokens';

import { Txt } from './text';

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
};

export function Chip({ label, selected = false, onPress }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected ? styles.selected : null]}>
      <Txt variant="soft" style={[styles.label, selected ? styles.labelOn : null]}>
        {label}
      </Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Palette.line,
    backgroundColor: Palette.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  selected: {
    backgroundColor: Palette.ink,
    borderColor: Palette.ink,
  },
  label: {
    fontFamily: FontFamily.bodySemi,
    color: Palette.ink,
  },
  labelOn: {
    color: Palette.onInk,
  },
});
