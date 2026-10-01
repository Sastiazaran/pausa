import { Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { Copy } from '@/i18n/copy';
import { Palette } from '@/theme/tokens';

import { Txt } from './ui/text';

export function SheetHeader({ title }: { title: string }) {
  const router = useRouter();
  return (
    <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.row}>
      <Txt variant="title" style={styles.title}>
        {title}
      </Txt>
      <Txt variant="soft">{Copy.form.close}</Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    flex: 1,
    color: Palette.ink,
  },
});
