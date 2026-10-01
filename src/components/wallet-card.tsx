import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';

import { Copy } from '@/i18n/copy';
import { Palette, Radius, Spacing } from '@/theme/tokens';

import { Txt } from './ui/text';

type WalletCardProps = {
  name: string;
  balance: string;
  onPress: () => void;
};

/** La tarjeta como objeto, no como un extracto de banco. */
export function WalletCard({ name, balance, onPress }: WalletCardProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [pressed ? styles.pressed : null]}>
      <LinearGradient colors={['#3A322C', '#2A2420', '#1E1A17']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
        <View style={styles.orb} />
        <Txt variant="label" style={styles.kicker}>
          {name}
        </Txt>
        <Txt variant="moneyLight">{balance}</Txt>
        <Txt variant="soft" style={styles.hint}>
          {Copy.today.month}
        </Txt>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    minHeight: 176,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Palette.blush,
    opacity: 0.35,
    right: -30,
    top: -40,
  },
  kicker: {
    color: Palette.onInkSoft,
  },
  hint: {
    color: Palette.onInkSoft,
  },
  pressed: {
    opacity: 0.92,
  },
});
