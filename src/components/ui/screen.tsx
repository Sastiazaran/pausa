import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackgroundGradient, Palette, Spacing } from '@/theme/tokens';

const TabClearance = 108;

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  /** Extra bottom space. Tabs need room for the bar; sheets need less. */
  clearance?: number;
  contentStyle?: ViewStyle;
};

/** Papel continuo detrás de cada pantalla. */
export function Screen({ children, scroll = true, clearance = TabClearance, contentStyle }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const padding = {
    paddingTop: insets.top + Spacing.lg,
    paddingBottom: insets.bottom + clearance,
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={BackgroundGradient} style={StyleSheet.absoluteFill} />
      <View style={styles.column}>
        {scroll ? (
          <ScrollView
            contentContainerStyle={[styles.content, padding, contentStyle]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.content, styles.fill, padding, contentStyle]}>{children}</View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.paper,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
  },
  fill: {
    flex: 1,
  },
  column: {
    flex: 1,
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
});
