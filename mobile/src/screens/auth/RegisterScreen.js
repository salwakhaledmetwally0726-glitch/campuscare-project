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

import API from "../../api/api";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Default role is community because most new users are issue reporters.
  const [role, setRole] = useState("community");

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !role) {
      Alert.alert("Missing Fields", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      Alert.alert("Success", "Account created successfully");

      navigation.replace("Login");
    } catch (error) {
      Alert.alert(
        "Registration Failed",
        error.response?.data?.error || "Failed to create account"
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

        <Text style={styles.subtitle}>Create Your CampusCare Account</Text>

        <View style={styles.flagLine}>
          <View style={styles.blackLine} />
          <View style={styles.redLine} />
          <View style={styles.goldLine} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Register</Text>

        <TextInput
          style={styles.input}
          placeholder="Full name"
          placeholderTextColor="#999999"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor="#999999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.roleTitle}>Select Role</Text>

        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              role === "community" && styles.activeRoleButton,
            ]}
            onPress={() => setRole("community")}
          >
            <Text
              style={[
                styles.roleText,
                role === "community" && styles.activeRoleText,
              ]}
            >
              Community
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleButton,
              role === "manager" && styles.activeRoleButton,
            ]}
            onPress={() => setRole("manager")}
          >
            <Text
              style={[
                styles.roleText,
                role === "manager" && styles.activeRoleText,
              ]}
            >
              Manager
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleButton,
              role === "worker" && styles.activeRoleButton,
            ]}
            onPress={() => setRole("worker")}
          >
            <Text
              style={[
                styles.roleText,
                role === "worker" && styles.activeRoleText,
              ]}
            >
              Worker
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Creating Account..." : "Create Account"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.replace("Login")}
        >
          <Text style={styles.buttonText}>Back to Login</Text>
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
    marginBottom: 30,
  },

  logoText: {
    fontSize: 34,
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
    fontSize: 16,
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
    padding: 24,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#111111",
    marginBottom: 22,
    textAlign: "center",
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 14,
    padding: 16,
    fontSize: 17,
    marginBottom: 16,
    color: "#111111",
  },

  roleTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111111",
    marginBottom: 12,
  },

  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  roleButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    alignItems: "center",
    marginHorizontal: 4,
    backgroundColor: "#FFFFFF",
  },

  activeRoleButton: {
    backgroundColor: "#D72638",
    borderColor: "#D72638",
  },

  roleText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111111",
  },

  activeRoleText: {
    color: "#FFFFFF",
  },

  registerButton: {
    backgroundColor: "#D72638",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 6,
  },

  loginButton: {
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