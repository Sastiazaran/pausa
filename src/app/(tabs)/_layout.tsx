import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';

import { Copy } from '@/i18n/copy';
import { FontFamily, Palette } from '@/theme/tokens';

const TabBarHeight = Platform.select({ ios: 88, default: 68 });

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Palette.blush,
        tabBarInactiveTintColor: Palette.inkSoft,
        tabBarStyle: styles.bar,
        tabBarLabelStyle: styles.label,
        sceneStyle: { backgroundColor: Palette.paper },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: Copy.tabs.today,
          tabBarIcon: ({ color }) => <Ionicons name="sunny-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="movimientos"
        options={{
          title: Copy.tabs.movements,
          tabBarIcon: ({ color }) => <Ionicons name="swap-horizontal-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="falta"
        options={{
          title: Copy.tabs.needs,
          tabBarIcon: ({ color }) => <Ionicons name="albums-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="precios"
        options={{
          title: Copy.tabs.prices,
          tabBarIcon: ({ color }) => <Ionicons name="pricetag-outline" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    marginHorizontal: 'auto',
    width: '100%',
    maxWidth: 440,
    backgroundColor: 'rgba(246, 241, 234, 0.96)',
    borderTopColor: Palette.line,
    borderTopWidth: 1,
    height: TabBarHeight,
    paddingTop: 8,
  },
  label: {
    fontFamily: FontFamily.bodySemi,
    fontSize: 11,
  },
});
