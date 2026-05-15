import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../api/api";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/login", {
        email,
        password,
      });

      const token = response.data.token;
      const user = response.data.user;

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      Alert.alert("Success", "Login successful");

      if (user.role === "community") {
        navigation.replace("CommunityDashboard");
      } else if (user.role === "manager") {
        navigation.replace("ManagerDashboard");
      } else if (user.role === "worker") {
        navigation.replace("WorkerDashboard");
      } else {
        Alert.alert("Error", "Unknown user role");
      }
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error.response?.data?.error || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>
          GIU <Text style={styles.redText}>Campus</Text>
          <Text style={styles.goldText}>Care</Text>
        </Text>

        <Text style={styles.subtitle}>
          Smart Campus Maintenance System
        </Text>

        <View style={styles.flagLine}>
          <View style={styles.blackLine} />
          <View style={styles.redLine} />
          <View style={styles.goldLine} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#999999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#999999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Logging In..." : "Login"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.buttonText}>Create New Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    padding: 24,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },

  logoText: {
    fontSize: 38,
    fontWeight: "900",
    color: "#111111",
  },

  redText: {
    color: "#D72638",
  },

  goldText: {
    color: "#F4B400",
  },

  subtitle: {
    fontSize: 17,
    color: "#666666",
    marginTop: 10,
    textAlign: "center",
  },

  flagLine: {
    flexDirection: "row",
    width: 220,
    height: 6,
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 18,
  },

  blackLine: {
    flex: 1,
    backgroundColor: "#111111",
  },

  redLine: {
    flex: 1,
    backgroundColor: "#D72638",
  },

  goldLine: {
    flex: 1,
    backgroundColor: "#F4B400",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 26,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#111111",
    marginBottom: 24,
    textAlign: "center",
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 14,
    padding: 16,
    fontSize: 17,
    marginBottom: 18,
    color: "#111111",
  },

  loginButton: {
    backgroundColor: "#D72638",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 6,
  },

  registerButton: {
    backgroundColor: "#111111",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 16,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
});