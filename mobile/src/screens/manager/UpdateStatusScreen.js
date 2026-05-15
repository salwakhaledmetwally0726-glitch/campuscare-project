import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import API from "../../api/api";

export default function UpdateStatusScreen({ route, navigation }) {
  const issueId = route?.params?.issueId || route?.params?.issue?.id;
  const passedIssue = route?.params?.issue || null;

  const [issue, setIssue] = useState(passedIssue);
  const [loading, setLoading] = useState(false);

  const loadIssue = async () => {
    if (!issueId) {
      Alert.alert("Error", "Issue ID is missing.");
      return;
    }

    try {
      setLoading(true);
      const response = await API.get(`/issues/${issueId}`);
      setIssue(response.data.issue);
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to load issue"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    if (!issueId) {
      Alert.alert("Error", "Issue ID is missing.");
      return;
    }

    try {
      await API.put(`/issues/${issueId}/status`, { status });
      Alert.alert("Success", `Issue status updated to ${status}`);
      loadIssue();
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to update issue status"
      );
    }
  };

  const closeIssue = async () => {
    if (!issueId) {
      Alert.alert("Error", "Issue ID is missing.");
      return;
    }

    try {
      await API.put(`/issues/${issueId}/close`);
      Alert.alert("Success", "Issue closed successfully");
      loadIssue();
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to close issue"
      );
    }
  };

  useEffect(() => {
    loadIssue();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>
          GIU <Text style={styles.redText}>Campus</Text>
          <Text style={styles.goldText}>Care</Text>
        </Text>
        <Text style={styles.subtitle}>Update Issue Status</Text>

        <View style={styles.flagLine}>
          <View style={styles.blackLine} />
          <View style={styles.redLine} />
          <View style={styles.goldLine} />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#D72638" />
      ) : (
        <View style={styles.card}>
          <Text style={styles.issueTitle}>{issue?.title || "Selected Issue"}</Text>
          <Text style={styles.text}>Category: {issue?.category || "N/A"}</Text>
          <Text style={styles.statusText}>
            Current Status: {issue?.status || "N/A"}
          </Text>

          <Text style={styles.sectionTitle}>Choose New Status</Text>

          <TouchableOpacity
            style={styles.goldButton}
            onPress={() => updateStatus("In Progress")}
          >
            <Text style={styles.buttonText}>In Progress</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.greenButton}
            onPress={() => updateStatus("Resolved")}
          >
            <Text style={styles.buttonText}>Resolved</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.redButton} onPress={closeIssue}>
            <Text style={styles.buttonText}>Close Issue</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.blackButton} onPress={loadIssue}>
            <Text style={styles.buttonText}>Refresh</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.blackButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 35 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 18,
  },
  header: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 24,
  },
  logoText: {
    fontSize: 32,
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
  },
  flagLine: {
    flexDirection: "row",
    width: 190,
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
    padding: 20,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  issueTitle: {
    fontSize: 25,
    fontWeight: "900",
    color: "#111111",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#444444",
    marginBottom: 6,
  },
  statusText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#D72638",
    marginVertical: 14,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: "#111111",
    marginTop: 18,
    marginBottom: 8,
  },
  goldButton: {
    backgroundColor: "#F4B400",
    padding: 16,
    borderRadius: 13,
    alignItems: "center",
    marginTop: 10,
  },
  greenButton: {
    backgroundColor: "#2EAD4B",
    padding: 16,
    borderRadius: 13,
    alignItems: "center",
    marginTop: 10,
  },
  redButton: {
    backgroundColor: "#D72638",
    padding: 16,
    borderRadius: 13,
    alignItems: "center",
    marginTop: 10,
  },
  blackButton: {
    backgroundColor: "#111111",
    padding: 16,
    borderRadius: 13,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
});