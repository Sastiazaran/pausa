import { Fraunces_500Medium, Fraunces_700Bold } from '@expo-google-fonts/fraunces';
import { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, useFonts } from '@expo-google-fonts/nunito';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Txt } from '@/components/ui/text';
import { AppDataProvider, LoadStatus, useAppData } from '@/data/app-data-context';
import { Copy } from '@/i18n/copy';
import { Palette, Spacing } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { status, error } = useAppData();

  useEffect(() => {
    if (status !== LoadStatus.Loading) {
      SplashScreen.hideAsync();
    }
  }, [status]);

  if (status === LoadStatus.Loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Palette.blush} />
        <Txt variant="soft">{Copy.loading}</Txt>
      </View>
    );
  }

  if (status === LoadStatus.Error) {
    return (
      <View style={styles.center}>
        <Txt variant="heading">{Copy.errorTitle}</Txt>
        <Txt variant="soft">{error}</Txt>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Palette.paper },
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="movimiento/nuevo" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="cuenta/nueva" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="cuenta/[id]" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="lista/nueva" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="lista/[id]" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="tarjeta" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Fraunces_500Medium,
    Fraunces_700Bold,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <AppDataProvider>
          <RootNavigator />
        </AppDataProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.paper,
  },
  center: {
    flex: 1,
    backgroundColor: Palette.paper,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    padding: Spacing.xl,
  },
});
