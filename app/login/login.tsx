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
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const { width } = useWindowDimensions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email dan password wajib diisi!");
      return;
    }

    setIsLoading(true);

    try {
      // Get users from AsyncStorage
      const existingUsers = await AsyncStorage.getItem("users");
      const users = existingUsers ? JSON.parse(existingUsers) : [];

      // Find user
      const user = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (user) {
        // Save login session
        await AsyncStorage.setItem("isLoggedIn", "true");
        await AsyncStorage.setItem("currentUser", JSON.stringify(user));
        
        // Save profile data
        await AsyncStorage.setItem("profile.name", user.name);
        await AsyncStorage.setItem("profile.email", user.email);
        await AsyncStorage.setItem("profile.phone", user.phone);

        Alert.alert("Berhasil", "Login berhasil!", [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)/home"),
          },
        ]);
      } else {
        Alert.alert("Error", "Email atau password salah!");
      }
    } catch (error) {
      Alert.alert("Error", "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
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
      <Text style={styles.subtitle}>
        Akses layanan UMKM dalam satu platform terpadu
      </Text>

      <LinearGradient
        colors={["rgba(102, 126, 234, 0.1)", "rgba(118, 75, 162, 0.1)"]}
        style={[styles.card, { width: cardWidth }]}
      >
        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="rgba(255,255,255,0.5)"
            />
            <TextInput
              placeholder="email@example.com"
              placeholderTextColor="rgba(255,255,255,0.4)"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="rgba(255,255,255,0.5)"
            />
            <TextInput
              placeholder="Masukkan password"
              placeholderTextColor="rgba(255,255,255,0.4)"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="rgba(255,255,255,0.5)"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Lupa Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
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

        {/* Register Link */}
        <TouchableOpacity
          onPress={() => router.push("../login/register")}
          style={styles.linkContainer}
        >
          <Text style={styles.linkText}>
            Belum punya akun?{" "}
            <Text style={styles.linkTextHighlight}>Daftar Sekarang</Text>
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Or Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>atau</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Social Login */}
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Ionicons name="logo-google" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Ionicons name="logo-facebook" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Ionicons name="logo-apple" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
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
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.1)",
  },
  logo: {
    height: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginBottom: 30,
    maxWidth: 320,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 8,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    gap: 12,
  },
  input: {
    flex: 1,
    color: "#fff",
    paddingVertical: 14,
    fontSize: 15,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#667eea",
    fontSize: 13,
    fontWeight: "600",
  },
  button: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  linkContainer: {
    alignItems: "center",
  },
  linkText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
  linkTextHighlight: {
    color: "#667eea",
    fontWeight: "700",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
    width: "80%",
    maxWidth: 400,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  dividerText: {
    color: "rgba(255,255,255,0.5)",
    marginHorizontal: 16,
    fontSize: 13,
  },
  socialContainer: {
    flexDirection: "row",
    gap: 16,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
});