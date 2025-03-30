import { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme as useNativeColorScheme } from "react-native";

type ColorSchemeType = "light" | "dark" | null;

// Create a context to hold our color scheme state
const ColorSchemeContext = createContext({
  colorScheme: "light" as ColorSchemeType,
  toggleColorScheme: () => {},
  isDark: false,
  setIsDark: (value: boolean) => {},
});

// Export the provider component
export function ColorSchemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the native color scheme
  const nativeColorScheme = useNativeColorScheme();

  // State to track if we should use dark mode
  const [isDark, setIsDark] = useState(nativeColorScheme === "dark");

  // Compute the actual color scheme based on isDark
  const colorScheme: ColorSchemeType = isDark ? "dark" : "light";

  // Function to toggle between light and dark
  const toggleColorScheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <ColorSchemeContext.Provider
      value={{
        colorScheme,
        toggleColorScheme,
        isDark,
        setIsDark,
      }}
    >
      {children}
    </ColorSchemeContext.Provider>
  );
}

// Export the hook to use in components
export function useColorScheme() {
  return useContext(ColorSchemeContext);
}
