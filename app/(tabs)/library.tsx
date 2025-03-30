import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/context/themeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data for demonstration - this would come from storage in the real app
const MOCK_HISTORY = [
  {
    id: "1",
    surah: "Al-Fatiha",
    ayah: "1-7",
    reciter: "Mishary Rashid Alafasy",
    timestamp: "2023-05-15T14:30:00Z",
    youtubeLink: "https://www.youtube.com/watch?v=example1",
  },
  {
    id: "2",
    surah: "Al-Baqarah",
    ayah: "255",
    reciter: "Abdul Rahman Al-Sudais",
    timestamp: "2023-05-14T10:15:00Z",
    youtubeLink: "https://www.youtube.com/watch?v=example2",
  },
  {
    id: "3",
    surah: "Yusuf",
    ayah: "1-3",
    reciter: "Raad Muhammad Al-Kurdi",
    timestamp: "2023-05-13T20:45:00Z",
    youtubeLink: "https://www.youtube.com/watch?v=example3",
  },
];

export default function LibraryScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [history, setHistory] = useState(MOCK_HISTORY);

  const renderHistoryItem = ({ item }) => (
    <Pressable
      style={({ pressed }) => [
        styles.historyItem,
        { backgroundColor: colors.card },
        pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
      ]}
    >
      <View style={styles.historyContent}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="music-note"
            size={24}
            color={colors.primary}
          />
        </View>
        <View style={styles.detailsContainer}>
          <ThemedText style={styles.surahTitle}>{item.surah}</ThemedText>
          <Text style={[styles.ayahSubtitle, { color: colors.icon }]}>
            Ayah {item.ayah} • {item.reciter}
          </Text>
          <Text style={[styles.timestamp, { color: colors.icon }]}>
            {new Date(item.timestamp).toLocaleDateString()}
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.playButton,
            pressed && { opacity: 0.8 },
          ]}
        >
          <MaterialCommunityIcons
            name="play"
            size={22}
            color={colors.primary}
          />
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <ThemedText style={styles.headerTitle}>Your Library</ThemedText>
      </LinearGradient>

      {history.length > 0 ? (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderHistoryItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="playlist-music"
            size={60}
            color={colors.icon}
          />
          <ThemedText style={styles.emptyText}>
            Your detection history will appear here
          </ThemedText>
        </View>
      )}
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
  listContainer: {
    padding: 16,
  },
  historyItem: {
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  historyContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
  },
  surahTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  ayahSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
  },
});
