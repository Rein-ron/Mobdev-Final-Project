import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();
const THEME_STORAGE_KEY = 'sbt.darkMode';

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isThemeReady, setIsThemeReady] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedValue = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedValue !== null) {
          setIsDarkMode(savedValue === 'true');
        }
      } catch (error) {
        console.log('Failed to load theme setting:', error.message);
      } finally {
        setIsThemeReady(true);
      }
    };

    loadTheme();
  }, []);

  const updateDarkMode = async (value) => {
    setIsDarkMode(value);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, String(value));
    } catch (error) {
      console.log('Failed to save theme setting:', error.message);
    }
  };

  const theme = {
    bg: isDarkMode ? '#121824' : '#f4f7fb',
    cardBg: isDarkMode ? '#1e2736' : '#fff',
    text: isDarkMode ? '#ffffff' : '#1f2a44',
    subText: isDarkMode ? '#9aa5b5' : '#777',
    border: isDarkMode ? '#2c3747' : '#f0f0f0',
    inputBg: isDarkMode ? '#252f41' : '#f9f9f9',
    inputBorder: isDarkMode ? '#364359' : '#eee',
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode: updateDarkMode, isThemeReady, theme }}>
      {isThemeReady ? children : null}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
