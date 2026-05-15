import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function CommunityDashboard({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>
          GIU <Text style={styles.redText}>Campus</Text>
          <Text style={styles.goldText}>Care</Text>
        </Text>
        <Text style={styles.subtitle}>Community Member Dashboard</Text>

        <View style={styles.flagLine}>
          <View style={styles.blackLine} />
          <View style={styles.redLine} />
          <View style={styles.goldLine} />
        </View>
      </View>

      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate("Profile")}
      >
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Report Campus Issue</Text>
        <Text style={styles.cardText}>
          Submit a new maintenance issue with photo, category, and location details.
        </Text>

        <TouchableOpacity
          style={styles.redButton}
          onPress={() => navigation.navigate("SubmitIssue")}
        >
          <Text style={styles.buttonText}>Submit New Issue</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>My Reported Issues</Text>
        <Text style={styles.cardText}>
          View and track the status of issues you submitted.
        </Text>

        <TouchableOpacity
          style={styles.blackButton}
          onPress={() => navigation.navigate("MyIssues")}
        >
          <Text style={styles.buttonText}>View My Issues</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => navigation.replace("Login")}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      <View style={{ height: 35 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 22,
    marginTop: 10,
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
    fontSize: 17,
    color: "#555555",
    marginTop: 6,
    textAlign: "center",
  },
  flagLine: {
    flexDirection: "row",
    width: 180,
    height: 5,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 14,
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
    borderRadius: 18,
    padding: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  cardTitle: {
    fontSize: 23,
    fontWeight: "900",
    color: "#111111",
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: "#555555",
    lineHeight: 23,
    marginBottom: 18,
  },
  profileButton: {
    backgroundColor: "#F4B400",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 18,
  },
  redButton: {
    backgroundColor: "#D72638",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  blackButton: {
    backgroundColor: "#111111",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#111111",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 40,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
});