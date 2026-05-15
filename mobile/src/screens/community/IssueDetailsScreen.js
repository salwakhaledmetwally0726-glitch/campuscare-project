import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import API from "../../api/api";

export default function IssueDetailsScreen({ route, navigation }) {
  const issueId = route?.params?.issueId || route?.params?.issue?.id;
  const passedIssue = route?.params?.issue || null;

  const [issue, setIssue] = useState(passedIssue);
  const [loading, setLoading] = useState(false);

  const loadIssueDetails = async () => {
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
        error.response?.data?.error || "Failed to load issue details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssueDetails();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>
          GIU <Text style={styles.redText}>Campus</Text>
          <Text style={styles.goldText}>Care</Text>
        </Text>
        <Text style={styles.subtitle}>Issue Details</Text>

        <View style={styles.flagLine}>
          <View style={styles.blackLine} />
          <View style={styles.redLine} />
          <View style={styles.goldLine} />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#D72638" />
      ) : issue ? (
        <View style={styles.card}>
          <Text style={styles.issueTitle}>{issue.title}</Text>

          <Text style={styles.statusText}>Status: {issue.status || "Pending"}</Text>

          <Text style={styles.sectionTitle}>Issue Information</Text>
          <Text style={styles.text}>Category: {issue.category || "N/A"}</Text>
          <Text style={styles.text}>Description: {issue.description || "N/A"}</Text>

          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.text}>Building: {issue.building || "N/A"}</Text>
          <Text style={styles.text}>Floor: {issue.floor || "N/A"}</Text>
          <Text style={styles.text}>Room: {issue.room || "N/A"}</Text>

          <Text style={styles.sectionTitle}>Assignment</Text>
          <Text style={styles.text}>
            Assigned To: {issue.assigned_to || "Not assigned yet"}
          </Text>

          <Text style={styles.sectionTitle}>Worker Update</Text>
          <Text style={styles.text}>
            Worker Comment: {issue.worker_comment || "No worker comment yet"}
          </Text>

          {issue.photo_url ? (
            <>
              <Text style={styles.sectionTitle}>Issue Photo</Text>
              <Image source={{ uri: issue.photo_url }} style={styles.image} />
            </>
          ) : (
            <Text style={styles.noImage}>No issue photo available</Text>
          )}

          {issue.completion_photo_url ? (
            <>
              <Text style={styles.sectionTitle}>Completion Photo</Text>
              <Image
                source={{ uri: issue.completion_photo_url }}
                style={styles.image}
              />
            </>
          ) : (
            <Text style={styles.noImage}>No completion photo uploaded yet</Text>
          )}

          <TouchableOpacity style={styles.redButton} onPress={loadIssueDetails}>
            <Text style={styles.buttonText}>Refresh Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.blackButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.issueTitle}>Issue not found</Text>
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
    fontSize: 26,
    fontWeight: "900",
    color: "#111111",
    marginBottom: 10,
  },
  statusText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#D72638",
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111111",
    marginTop: 18,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: "#444444",
    marginBottom: 6,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 14,
    marginTop: 8,
    marginBottom: 10,
  },
  noImage: {
    color: "#777777",
    fontSize: 15,
    fontStyle: "italic",
    marginTop: 14,
  },
  redButton: {
    backgroundColor: "#D72638",
    padding: 16,
    borderRadius: 13,
    alignItems: "center",
    marginTop: 18,
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