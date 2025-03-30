import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme, useTheme } from "@/context/themeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Define TypeScript interfaces
interface SettingsItemProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  description?: string;
  hasSwitch: boolean;
  switchValue?: boolean;
  switchSetter?:
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((value: boolean) => void);
}

export default function SettingsScreen() {
  const { isDark, setIsDark } = useTheme();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as "light" | "dark"];

  // These would connect to actual functionality in a real app
  const [notifications, setNotifications] = useState(true);
  const [saveHistory, setSaveHistory] = useState(true);
  const [highQualityAudio, setHighQualityAudio] = useState(false);

  const toggleSwitch = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    value: boolean
  ) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setter(value);
  };

  // Special handler for dark mode toggle
  const handleDarkModeToggle = (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsDark(value);
  };

  const renderSettingsItem = ({
    icon,
    title,
    description,
    hasSwitch,
    switchValue,
    switchSetter,
  }: SettingsItemProps) => (
    <View style={[styles.settingsItem, { borderBottomColor: colors.border }]}>
      <View style={styles.settingsIconContainer}>
        <MaterialCommunityIcons name={icon} size={24} color={colors.primary} />
      </View>
      <View style={styles.settingsContent}>
        <ThemedText style={styles.settingsTitle}>{title}</ThemedText>
        {description && (
          <ThemedText
            style={[styles.settingsDescription, { color: colors.icon }]}
          >
            {description}
          </ThemedText>
        )}
      </View>
      {hasSwitch && switchValue !== undefined && switchSetter && (
        <Switch
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor="#ffffff"
          ios_backgroundColor={colors.border}
          onValueChange={(value) => {
            if (switchSetter) {
              switchSetter(value);
            }
          }}
          value={switchValue}
        />
      )}
      {!hasSwitch && (
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={colors.icon}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <ThemedText style={styles.headerTitle}>Settings</ThemedText>
      </LinearGradient>

      <ScrollView style={styles.settingsContainer}>
        <View
          style={[styles.settingsSection, { backgroundColor: colors.card }]}
        >
          <ThemedText style={[styles.sectionTitle, { color: colors.primary }]}>
            Appearance
          </ThemedText>
          {renderSettingsItem({
            icon: "theme-light-dark",
            title: "Dark Mode",
            description: "Toggle between light and dark theme",
            hasSwitch: true,
            switchValue: isDark,
            switchSetter: handleDarkModeToggle,
          })}
        </View>

        <View
          style={[styles.settingsSection, { backgroundColor: colors.card }]}
        >
          <ThemedText style={[styles.sectionTitle, { color: colors.primary }]}>
            App Preferences
          </ThemedText>
          {renderSettingsItem({
            icon: "bell-outline",
            title: "Notifications",
            description: "Receive alerts about new features",
            hasSwitch: true,
            switchValue: notifications,
            switchSetter: setNotifications,
          })}
          {renderSettingsItem({
            icon: "history",
            title: "Save History",
            description: "Store your recitation detections",
            hasSwitch: true,
            switchValue: saveHistory,
            switchSetter: setSaveHistory,
          })}
          {renderSettingsItem({
            icon: "quality-high",
            title: "High Quality Audio",
            description: "Use higher quality audio processing",
            hasSwitch: true,
            switchValue: highQualityAudio,
            switchSetter: setHighQualityAudio,
          })}
        </View>

        <View
          style={[styles.settingsSection, { backgroundColor: colors.card }]}
        >
          <ThemedText style={[styles.sectionTitle, { color: colors.primary }]}>
            About
          </ThemedText>
          {renderSettingsItem({
            icon: "information-outline",
            title: "About ReciteSense",
            description: "Learn more about the app",
            hasSwitch: false,
          })}
          {renderSettingsItem({
            icon: "bug-outline",
            title: "Report an Issue",
            description: "Help us improve ReciteSense",
            hasSwitch: false,
          })}
          {renderSettingsItem({
            icon: "email-outline",
            title: "Contact Us",
            description: "Send us your feedback",
            hasSwitch: false,
          })}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.versionContainer,
            pressed && { opacity: 0.7 },
          ]}
        >
          <ThemedText style={[styles.versionText, { color: colors.icon }]}>
            ReciteSense v1.0.0
          </ThemedText>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  settingsContainer: {
    flex: 1,
    padding: 16,
  },
  settingsSection: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  settingsContent: {
    flex: 1,
    marginLeft: 12,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingsDescription: {
    fontSize: 12,
    marginTop: 3,
  },
  versionContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
  },
});
