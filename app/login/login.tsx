import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

const API_URL =
  Platform.OS === "web"
    ? "http://localhost:3001"
    : "http://192.168.1.20:3001";

export default function LoginScreen() {
  const { width } = useWindowDimensions();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    const trimmedEmail = email.toLowerCase().trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert("Error", "Email dan password wajib diisi!");
      return;
    }

    setIsLoading(true);

    try {
      console.log("=== LOGIN START ===");
      console.log("POST:", `${API_URL}/api/login`);

      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });

      const data = await res.json();
      console.log("STATUS:", res.status);
      console.log("RESPONSE:", data);

      if (!res.ok) {
        Alert.alert("Login Gagal", data.error || "Email atau password salah");
        return;
      }

      // ✅ simpan session
      await AsyncStorage.setItem("isLoggedIn", "true");
      await AsyncStorage.setItem(
        "currentUser",
        JSON.stringify(data.user)
      );

      console.log("LOGIN SUCCESS:", data.user);

      // Redirect ke home tab setelah session tersimpan
      // Gunakan requestAnimationFrame untuk memastikan UI sudah ter-update
      requestAnimationFrame(() => {
        console.log("Navigating to /(tabs)/home");
        try {
          router.replace("/(tabs)/home");
        } catch (e) {
          console.error("Navigation failed, trying alternative:", e);
          // Fallback: coba dengan path yang berbeda
          router.push("/(tabs)/home");
        }
      });
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      Alert.alert(
        "Error",
        "Tidak dapat terhubung ke server.\nPastikan backend aktif di port 3001."
      );
    } finally {
      setIsLoading(false);
      console.log("=== LOGIN END ===");
    }
  };

  const isWeb = Platform.OS === "web";
  const cardWidth = isWeb ? Math.min(width * 0.4, 480) : "100%";

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingVertical: isWeb ? 80 : 40 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={styles.logoCircle}
        >
          <Image
            source={require("../../assets/images/Logo.png")}
            style={[styles.logo, { width: isWeb ? 140 : 100 }]}
            resizeMode="contain"
          />
        </LinearGradient>
      </View>

      <Text style={styles.title}>Masuk ke Sapa UMKM</Text>
      <Text style={styles.subtitle}>Masuk untuk mengelola UMKM Anda</Text>

      <LinearGradient
        colors={["rgba(102,126,234,0.1)", "rgba(118,75,162,0.1)"]}
        style={[styles.card, { width: cardWidth }]}
      >
        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#aaa" />
            <TextInput
              placeholder="email@example.com"
              placeholderTextColor="#999"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
        </View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#aaa" />
            <TextInput
              placeholder="Masukkan password"
              placeholderTextColor="#999"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#aaa"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Memproses..." : "Masuk"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Register */}
        <TouchableOpacity
          onPress={() => router.push("/login/register")}
          style={styles.linkContainer}
        >
          <Text style={styles.linkText}>
            Belum punya akun?{" "}
            <Text style={styles.linkTextHighlight}>Daftar</Text>
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0a0e27",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logoContainer: { marginBottom: 20 },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: { height: 60 },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    color: "rgba(255,255,255,0.7)",
    marginBottom: 30,
  },
  card: {
    borderRadius: 20,
    padding: 24,
  },
  inputGroup: { marginBottom: 20 },
  label: { color: "#fff", marginBottom: 8 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    color: "#fff",
    paddingVertical: 14,
  },
  button: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  linkContainer: { alignItems: "center" },
  linkText: { color: "rgba(255,255,255,0.7)" },
  linkTextHighlight: { color: "#667eea", fontWeight: "700" },
});
