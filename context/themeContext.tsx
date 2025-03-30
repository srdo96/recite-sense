import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme as useNativeColorScheme } from "react-native";

// Define theme context type
type ThemeContextType = {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
  toggleTheme: () => void;
};

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  setIsDark: () => {},
  toggleTheme: () => {},
});

// Provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const deviceTheme = useNativeColorScheme();
  const [isDark, setIsDark] = useState(deviceTheme === "dark");

  // Update if device theme changes
  useEffect(() => {
    setIsDark(deviceTheme === "dark");
  }, [deviceTheme]);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Helper hook to get color scheme based on isDark
export const useColorScheme = () => {
  const { isDark } = useTheme();
  return isDark ? "dark" : "light";
};
