import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function CommunityDashboard({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Community Dashboard</Text>

      <Text style={styles.subtitle}>Welcome to CampusCare</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("SubmitIssue")}
      >
        <Text style={styles.buttonText}>Report New Issue</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => navigation.navigate("MyIssues")}
      >
        <Text style={styles.buttonSecondaryText}>My Issues</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.logout}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40,
    color: "#555",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 17,
  },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonSecondaryText: {
    color: "#007bff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 17,
  },
  logout: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
  },
});