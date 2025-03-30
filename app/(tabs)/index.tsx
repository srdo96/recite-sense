import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/context/themeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface RecitationResult {
  surah: string;
  ayah: string;
  reciter: string;
  youtubeLink?: string;
}

export default function DetectionScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { width: screenWidth } = Dimensions.get("window");

  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState<RecitationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const animationRef = useRef<LottieView>(null);
  const recordingTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Request permission to use the microphone
    const getPermission = async () => {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        setHasPermission(status === "granted");
        if (status !== "granted") {
          Alert.alert(
            "Microphone Permission Required",
            "ReciteSense needs access to your microphone to identify Quran recitations.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Settings", onPress: () => Linking.openSettings() },
            ]
          );
        }
      } catch (error) {
        console.error("Error requesting audio permission:", error);
        setHasPermission(false);
      }
    };

    getPermission();

    // Configure audio session
    Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    return () => {
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRecording) {
      // Start pulse animation when recording
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Start recording animation
      if (animationRef.current) {
        animationRef.current.play();
      }

      // Start recording timer
      setRecordingDuration(0);
      recordingTimer.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      // Stop animations when not recording
      pulseAnim.setValue(1);
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();

      if (animationRef.current) {
        animationRef.current.pause();
      }

      // Clear recording timer
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
        recordingTimer.current = null;
      }
    }
  }, [isRecording, pulseAnim]);

  useEffect(() => {
    // Fade in and scale up the result card
    if (result) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.95);
    }
  }, [result, fadeAnim, scaleAnim]);

  const startRecording = async () => {
    try {
      // Clear previous results
      setResult(null);

      // Configure audio recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Auto-stop recording after 10 seconds
      setTimeout(() => {
        if (isRecording) {
          stopRecording();
        }
      }, 10000);
    } catch (error) {
      console.error("Error starting recording:", error);
      Alert.alert(
        "Recording Error",
        "Failed to start recording. Please try again."
      );
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      setIsLoading(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Stop the recording
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (uri) {
        // In a real app, we would send the audio file to the backend
        // For this demo, we'll simulate a response after a delay
        await processAudioRecording(uri);
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
      Alert.alert(
        "Recording Error",
        "Failed to process recording. Please try again."
      );
      setIsLoading(false);
    }
  };

  const processAudioRecording = async (uri: string) => {
    try {
      // In a real app, this would send the audio to your backend for processing
      // For demo purposes, we'll simulate a network request and response

      // Get the audio file info
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists) {
        console.log("Audio file size:", fileInfo.size);
      }

      // Simulate network request to backend (in a real app, you'd use fetch)
      setTimeout(() => {
        // Mock response
        const mockResult: RecitationResult = {
          surah: "Al-Baqarah",
          ayah: "255-257",
          reciter: "Mishary Rashid Alafasy",
          youtubeLink: "https://www.youtube.com/watch?v=1nx3mDwQjLY",
        };

        setResult(mockResult);
        setIsLoading(false);
      }, 2500);
    } catch (error) {
      console.error("Error processing audio:", error);
      setIsLoading(false);
      Alert.alert(
        "Processing Error",
        "Failed to analyze the recording. Please try again."
      );
    }
  };

  const openYoutubeLink = async () => {
    if (result?.youtubeLink) {
      const supported = await Linking.canOpenURL(result.youtubeLink);
      if (supported) {
        await Linking.openURL(result.youtubeLink);
      } else {
        Alert.alert("Error", "Cannot open this YouTube link");
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Render different content based on state
  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <LottieView
            source={require("@/assets/animations/quran-loading.json")}
            autoPlay
            loop
            style={styles.loadingAnimation}
          />
          <ThemedText style={styles.loadingText}>
            Identifying recitation...
          </ThemedText>
        </View>
      );
    }

    if (result) {
      return (
        <Animated.View
          style={[
            styles.resultContainer,
            {
              opacity: fadeAnim,
              backgroundColor: colors.card,
              transform: [{ scale: scaleAnim }],
              width: screenWidth > 500 ? 500 : screenWidth - 40,
            },
          ]}
        >
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.resultHeader}
          >
            <View style={styles.resultIconContainer}>
              <MaterialCommunityIcons
                name="book-open-page-variant"
                size={28}
                color="white"
              />
            </View>
            <ThemedText style={styles.resultHeaderText}>
              Recitation Identified!
            </ThemedText>
          </LinearGradient>

          <View style={styles.resultContent}>
            <View style={styles.resultRow}>
              <ThemedText style={styles.resultLabel}>Surah:</ThemedText>
              <ThemedText style={styles.resultValue}>{result.surah}</ThemedText>
            </View>
            <View style={styles.resultRow}>
              <ThemedText style={styles.resultLabel}>Ayah:</ThemedText>
              <ThemedText style={styles.resultValue}>{result.ayah}</ThemedText>
            </View>
            <View style={styles.resultRow}>
              <ThemedText style={styles.resultLabel}>Reciter:</ThemedText>
              <ThemedText style={styles.resultValue}>
                {result.reciter}
              </ThemedText>
            </View>

            {result.youtubeLink && (
              <Pressable
                style={({ pressed }) => [
                  styles.youtubeButton,
                  { backgroundColor: colors.accent },
                  pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
                ]}
                onPress={openYoutubeLink}
              >
                <MaterialCommunityIcons
                  name="youtube"
                  size={24}
                  color="white"
                />
                <Text style={styles.youtubeButtonText}>Listen on YouTube</Text>
              </Pressable>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.newRecordingButton,
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => setResult(null)}
            >
              <ThemedText style={styles.newRecordingButtonText}>
                New Recording
              </ThemedText>
            </Pressable>
          </View>
        </Animated.View>
      );
    }

    return (
      <View style={styles.instructionContainer}>
        <ThemedText style={styles.instructionTitle}>
          Tap the button and recite
        </ThemedText>
        <ThemedText style={[styles.instructionText, { color: colors.icon }]}>
          ReciteSense will identify the Surah, Ayah, and Reciter
        </ThemedText>
        <LottieView
          ref={animationRef}
          source={require("@/assets/animations/sound-waves.json")}
          style={styles.waveAnimation}
          speed={1.5}
        />
        {isRecording && (
          <View style={styles.recordingInfoContainer}>
            <View
              style={[
                styles.recordingIndicator,
                { backgroundColor: colors.error },
              ]}
            />
            <ThemedText style={styles.recordingDuration}>
              {formatTime(recordingDuration)} / 0:10
            </ThemedText>
          </View>
        )}
      </View>
    );
  };

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
        <ThemedText style={styles.headerTitle}>ReciteSense</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Quran Recitation Identifier
        </ThemedText>
      </LinearGradient>

      <View style={styles.content}>
        {renderContent()}

        <View style={styles.buttonContainer}>
          <Animated.View
            style={[
              styles.pulseCircle,
              {
                transform: [{ scale: pulseAnim }],
                backgroundColor: isRecording
                  ? colors.error + "50"
                  : colors.primary + "20",
              },
            ]}
          />
          <Pressable
            style={({ pressed }) => [
              styles.recordButton,
              { backgroundColor: isRecording ? colors.error : colors.primary },
              pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
              !hasPermission && { opacity: 0.5 },
            ]}
            onPress={isRecording ? stopRecording : startRecording}
            disabled={isLoading || hasPermission === false}
          >
            <MaterialCommunityIcons
              name={isRecording ? "stop" : "microphone"}
              size={32}
              color="white"
            />
          </Pressable>
          {!hasPermission && (
            <ThemedText style={styles.permissionText}>
              Microphone permission required
            </ThemedText>
          )}
        </View>
      </View>
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
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 28,
    paddingTop: 4,
    fontWeight: "bold",
    color: "white",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-medium",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "white",
    opacity: 0.9,
    marginTop: 4,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center",
  },
  instructionContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: 30,
    width: "100%",
  },
  instructionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-medium",
  },
  instructionText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  waveAnimation: {
    width: 240,
    height: 120,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  pulseCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    position: "absolute",
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingAnimation: {
    width: 200,
    height: 200,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 20,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-medium",
  },
  resultContainer: {
    borderRadius: 16,
    overflow: "hidden",
    marginVertical: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    alignSelf: "center",
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  resultIconContainer: {
    marginRight: 12,
  },
  resultHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-medium",
  },
  resultContent: {
    padding: 20,
  },
  resultRow: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: "600",
    width: 80,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-medium",
  },
  resultValue: {
    fontSize: 16,
    flex: 1,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  youtubeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  youtubeButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 16,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-medium",
  },
  newRecordingButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    marginTop: 16,
  },
  newRecordingButtonText: {
    fontWeight: "600",
    fontSize: 15,
    textDecorationLine: "underline",
  },
  recordingInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  recordingIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  recordingDuration: {
    fontSize: 16,
    fontWeight: "500",
  },
  permissionText: {
    marginTop: 10,
    fontSize: 14,
    color: "red",
    textAlign: "center",
  },
});
