import React, { createContext, useContext, useEffect, useState } from 'react';

// Define all available themes
export const THEME_PRESETS = {
  light: {
    name: 'Light',
    background: '220 20% 97%',
    foreground: '220 25% 8%',
    card: '0 0% 100%',
    primary: '262 80% 58%',
    accent: '290 70% 60%',
    isDark: false,
  },
  dark: {
    name: 'Dark',
    background: '224 25% 6%',
    foreground: '220 15% 92%',
    card: '224 22% 10%',
    primary: '262 80% 58%',
    accent: '290 70% 60%',
    isDark: true,
  },
};

// Brand color options
export const BRAND_COLORS = {
  purple: {
    name: 'Midnight Purple',
    primary: '262 80% 58%',
    accent: '290 70% 60%',
    glow: '262 80% 58%',
  },
  green: {
    name: 'Lime Green',
    primary: '82 88% 50%',
    accent: '80 85% 45%',
    glow: '82 88% 50%',
  },
  blue: {
    name: 'Ocean Blue',
    primary: '217 90% 55%',
    accent: '200 80% 60%',
    glow: '217 90% 55%',
  },
  pink: {
    name: 'Neon Pink',
    primary: '320 85% 55%',
    accent: '340 80% 60%',
    glow: '320 85% 55%',
  },
  orange: {
    name: 'Sunset Orange',
    primary: '25 95% 55%',
    accent: '15 90% 60%',
    glow: '25 95% 55%',
  },
  cyan: {
    name: 'Cyber Cyan',
    primary: '180 85% 50%',
    accent: '195 80% 55%',
    glow: '180 85% 50%',
  },
};

// Create context
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [backgroundTheme, setBackgroundTheme] = useState(() => {
    return localStorage.getItem('backgroundTheme') || 'dark';
  });

  const [brandColor, setBrandColor] = useState(() => {
    return localStorage.getItem('brandColor') || 'purple';
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    const themeConfig = THEME_PRESETS[backgroundTheme];
    const brandConfig = BRAND_COLORS[brandColor];

    // Apply background theme
    if (backgroundTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Set CSS variables for background theme
    Object.entries(themeConfig).forEach(([key, value]) => {
      if (key !== 'isDark' && key !== 'name') {
        root.style.setProperty(`--${key}`, value);
      }
    });

    // Set CSS variables for brand colors
    Object.entries(brandConfig).forEach(([key, value]) => {
      if (key !== 'name') {
        root.style.setProperty(`--${key}`, value);
      }
    });

    // Persist choices
    localStorage.setItem('backgroundTheme', backgroundTheme);
    localStorage.setItem('brandColor', brandColor);
  }, [backgroundTheme, brandColor]);

  const toggleBackgroundTheme = () => {
    setBackgroundTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const changeBackgroundTheme = (theme) => {
    if (THEME_PRESETS[theme]) {
      setBackgroundTheme(theme);
    }
  };

  const changeBrandColor = (color) => {
    if (BRAND_COLORS[color]) {
      setBrandColor(color);
    }
  };

  const value = {
    backgroundTheme,
    brandColor,
    toggleBackgroundTheme,
    changeBackgroundTheme,
    changeBrandColor,
    allBackgroundThemes: Object.keys(THEME_PRESETS),
    allBrandColors: Object.keys(BRAND_COLORS),
    getCurrentTheme: () => THEME_PRESETS[backgroundTheme],
    getCurrentBrandColor: () => BRAND_COLORS[brandColor],
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
