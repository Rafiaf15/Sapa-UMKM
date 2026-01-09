import { Ionicons } from "@expo/vector-icons";
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

const API_URL = Platform.OS === "web" ? "http://localhost:3001" : "http://192.168.0.231:3001";

export default function RegisterScreen() {
  const { width } = useWindowDimensions();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
    return phoneRegex.test(phone);
  };

  const handleRegister = async () => {
    // Trim dan normalize semua input
    const trimmedName = name.trim();
    const trimmedEmail = email.toLowerCase().trim();
    const trimmedPhone = phone.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    // Validation
    if (!trimmedName || !trimmedEmail || !trimmedPhone || !trimmedPassword || !trimmedConfirmPassword) {
      Alert.alert("Error", "Semua field wajib diisi!");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      Alert.alert("Error", "Format email tidak valid!");
      return;
    }

    if (!validatePhone(trimmedPhone)) {
      Alert.alert("Error", "Format nomor telepon tidak valid!");
      return;
    }

    if (trimmedPassword.length < 6) {
      Alert.alert("Error", "Password minimal 6 karakter!");
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      Alert.alert("Error", "Password tidak cocok!");
      return;
    }

    setIsLoading(true);

    try {
      console.log("=== REGISTER START ===");
      console.log("Sending registration to:", `${API_URL}/api/users`);
      console.log("Data:", { 
        name: trimmedName, 
        email: trimmedEmail, 
        phone: trimmedPhone 
      });
      
      const res = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: trimmedName, 
          email: trimmedEmail, 
          phone: trimmedPhone, 
          password: trimmedPassword 
        }),
      });

      console.log("Response status:", res.status);

      const data = await res.json();
      console.log("Response data:", JSON.stringify(data, null, 2));
      
      if (!res.ok) {
        console.log("Register failed:", data.error);
        Alert.alert("Error", data.error || "Gagal membuat akun");
        return;
      }

      console.log("Register success!");

      // Clear form
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");

      Alert.alert("Berhasil", "Akun berhasil dibuat! Silakan login.", [
        {
          text: "OK",
          onPress: () => {
            console.log("Navigating back to login...");
            router.back(); // Kembali ke halaman login
          },
        },
      ]);
      
    } catch (error: any) {
      console.error("=== REGISTER ERROR ===");
      console.error("Error:", error);
      Alert.alert("Error", `Gagal membuat akun: ${error.message}\n\nPastikan server jalan di port 3001!`);
    } finally {
      setIsLoading(false);
      console.log("=== REGISTER END ===");
    }
  };

  const isWeb = Platform.OS === "web";
  const cardWidth = isWeb ? Math.min(width * 0.4, 500) : "100%";

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingVertical: isWeb ? 60 : 40 },
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

      {/* Header */}
      <Text style={styles.title}>Daftar Akun Baru</Text>
      <Text style={styles.subtitle}>
        Bergabunglah dengan ribuan pelaku UMKM di seluruh Indonesia
      </Text>

      {/* Form Card */}
      <LinearGradient
        colors={["rgba(102, 126, 234, 0.1)", "rgba(118, 75, 162, 0.1)"]}
        style={[styles.card, { width: cardWidth }]}
      >
        {/* Name Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nama Lengkap</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color="rgba(255,255,255,0.5)"
            />
            <TextInput
              placeholder="Masukkan nama lengkap"
              placeholderTextColor="rgba(255,255,255,0.4)"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>
        </View>

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

        {/* Phone Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>No. Handphone</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="call-outline"
              size={20}
              color="rgba(255,255,255,0.5)"
            />
            <TextInput
              placeholder="08xxxxxxxxxx"
              placeholderTextColor="rgba(255,255,255,0.4)"
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
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
              placeholder="Minimal 6 karakter"
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

        {/* Confirm Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Konfirmasi Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="rgba(255,255,255,0.5)"
            />
            <TextInput
              placeholder="Ulangi password"
              placeholderTextColor="rgba(255,255,255,0.4)"
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="rgba(255,255,255,0.5)"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Register Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Mendaftar..." : "Daftar Sekarang"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Login Link */}
        <TouchableOpacity
          onPress={() => {
            console.log("Navigating to login from link...");
            router.back();
          }}
          style={styles.linkContainer}
        >
          <Text style={styles.linkText}>
            Sudah punya akun?{" "}
            <Text style={styles.linkTextHighlight}>Masuk Sekarang</Text>
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Terms */}
      <Text style={styles.terms}>
        Dengan mendaftar, Anda menyetujui{" "}
        <Text style={styles.termsLink}>Syarat & Ketentuan</Text> dan{" "}
        <Text style={styles.termsLink}>Kebijakan Privasi</Text> kami
      </Text>
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
    maxWidth: 380,
    lineHeight: 20,
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
  button: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
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
  terms: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    marginTop: 24,
    maxWidth: 340,
    lineHeight: 18,
  },
  termsLink: {
    color: "#667eea",
    fontWeight: "600",
  },
});