import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { FontFamily, Palette, Radius, Spacing } from '@/theme/tokens';

import { Txt } from './text';

type FieldProps = TextInputProps & {
  label: string;
  hint?: string;
};

export function Field({ label, hint, style, ...rest }: FieldProps) {
  return (
    <View style={styles.wrap}>
      <Txt variant="label">{label}</Txt>
      <TextInput
        placeholderTextColor={Palette.inkSoft}
        style={[styles.input, style]}
        {...rest}
      />
      {hint ? <Txt variant="soft">{hint}</Txt> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.sm,
  },
  input: {
    backgroundColor: Palette.card,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.line,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontFamily: FontFamily.body,
    fontSize: 16,
    color: Palette.ink,
  },
});
