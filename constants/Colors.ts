/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

/**
 * ReciteSense App Color Palette
 * Islamic-themed colors for light and dark mode
 */

const primaryLight = "#0E8A59"; // Primary Islamic green
const primaryDark = "#10B981"; // Bright green for dark mode
const secondaryLight = "#1E40AF"; // Royal blue
const secondaryDark = "#3B82F6"; // Bright blue for dark mode

export const Colors = {
  light: {
    text: "#11181C",
    background: "#FFFFFF",
    tint: primaryLight,
    primary: primaryLight,
    secondary: secondaryLight,
    accent: "#8B5CF6", // Purple accent
    success: "#22C55E",
    error: "#EF4444",
    warning: "#F59E0B",
    card: "#F3F4F6",
    border: "#E5E7EB",
    icon: "#64748B",
    tabIconDefault: "#94A3B8",
    tabIconSelected: primaryLight,
  },
  dark: {
    text: "#F3F4F6",
    background: "#0F172A", // Dark blue background
    tint: primaryDark,
    primary: primaryDark,
    secondary: secondaryDark,
    accent: "#A78BFA", // Lighter purple for dark mode
    success: "#4ADE80",
    error: "#F87171",
    warning: "#FBBF24",
    card: "#1E293B",
    border: "#334155",
    icon: "#94A3B8",
    tabIconDefault: "#64748B",
    tabIconSelected: primaryDark,
  },
};
