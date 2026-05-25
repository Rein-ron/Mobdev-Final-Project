import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}