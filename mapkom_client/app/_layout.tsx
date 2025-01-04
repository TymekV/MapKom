import { Stack } from 'expo-router';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { useColorScheme } from 'react-native';
import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from 'react-native-paper';
import { Inter_900Black, useFonts } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavLightTheme,
  ThemeProvider,
} from '@react-navigation/native';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from '@/lib/i18n';
import { createLanguageDetector } from 'react-native-localization-settings';
import { StatusBar } from 'expo-status-bar';

const languageDetector = createLanguageDetector({});

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default function RootLayoutWrapper() {
  const [loaded, error] = useFonts({
    Inter_900Black,
    ...MaterialCommunityIcons.font,
  });

  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return <RootLayout />;
}

function RootLayout() {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();

  const paperTheme =
    colorScheme === 'dark'
      ? { ...MD3DarkTheme, colors: theme.dark }
      : { ...MD3LightTheme, colors: theme.light };

  const { DarkTheme, LightTheme } = adaptNavigationTheme({
    reactNavigationDark: NavDarkTheme,
    reactNavigationLight: NavLightTheme,
    materialDark: MD3DarkTheme,
    materialLight: MD3LightTheme,
  });

  return (
    <ThemeProvider
      value={
        colorScheme === 'light'
          ? { ...LightTheme, fonts: NavLightTheme.fonts }
          : { ...DarkTheme, fonts: NavDarkTheme.fonts }
      }>
      <PaperProvider theme={paperTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </PaperProvider>
    </ThemeProvider>
  );
}
