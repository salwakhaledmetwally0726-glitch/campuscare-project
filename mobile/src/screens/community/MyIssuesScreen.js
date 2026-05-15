import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import API from "../../api/api";

export default function MyIssuesScreen({ navigation }) {
  const [issues, setIssues] = useState([]);
  const [expandedIssueId, setExpandedIssueId] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadMyIssues = async () => {
    try {
      setLoading(true);
      const res = await API.get("/issues/my");
      setIssues(res.data.issues || []);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.error || "Failed to load issues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyIssues();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>
          GIU <Text style={styles.redText}>Campus</Text>
          <Text style={styles.goldText}>Care</Text>
        </Text>
        <Text style={styles.subtitle}>My Reported Issues</Text>

        <View style={styles.flagLine}>
          <View style={styles.blackLine} />
          <View style={styles.redLine} />
          <View style={styles.goldLine} />
        </View>
      </View>

      <TouchableOpacity style={styles.redButton} onPress={loadMyIssues}>
        <Text style={styles.buttonText}>
          {loading ? "Refreshing..." : "Refresh My Issues"}
        </Text>
      </TouchableOpacity>

      {issues.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No Issues Found</Text>
          <Text style={styles.emptyText}>
            You have not submitted any campus issues yet.
          </Text>

          <TouchableOpacity
            style={styles.blackButton}
            onPress={() => navigation.navigate("SubmitIssue")}
          >
            <Text style={styles.buttonText}>Submit New Issue</Text>
          </TouchableOpacity>
        </View>
      ) : (
        issues.map((issue) => (
          <View key={issue.id} style={styles.card}>
            <Text style={styles.issueTitle}>{issue.title}</Text>
            <Text style={styles.text}>Category: {issue.category}</Text>
            <Text style={styles.statusText}>Status: {issue.status}</Text>

            {expandedIssueId === issue.id && (
              <>
                <Text style={styles.sectionTitle}>Issue Location</Text>
                <Text style={styles.text}>Building: {issue.building}</Text>
                <Text style={styles.text}>Floor: {issue.floor}</Text>
                <Text style={styles.text}>Room: {issue.room}</Text>

                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.text}>{issue.description}</Text>

                <Text style={styles.sectionTitle}>Issue Photo</Text>
                {issue.photo_url ? (
                  <Image source={{ uri: issue.photo_url }} style={styles.issueImage} />
                ) : (
                  <Text style={styles.noPhotoText}>No issue photo uploaded</Text>
                )}

                <Text style={styles.sectionTitle}>Completion Photo</Text>
                {issue.completion_photo_url ? (
                  <Image
                    source={{ uri: issue.completion_photo_url }}
                    style={styles.issueImage}
                  />
                ) : (
                  <Text style={styles.noPhotoText}>No completion photo yet</Text>
                )}

                {issue.assigned_to ? (
                  <Text style={styles.assignedText}>
                    Assigned Worker ID: {issue.assigned_to}
                  </Text>
                ) : (
                  <Text style={styles.notAssignedText}>Not assigned yet</Text>
                )}

                {issue.worker_comment ? (
                  <Text style={styles.commentText}>
                    Worker Comment: {issue.worker_comment}
                  </Text>
                ) : (
                  <Text style={styles.noPhotoText}>No worker comment yet</Text>
                )}
              </>
            )}

            <TouchableOpacity
              style={styles.blackButton}
              onPress={() =>
                setExpandedIssueId(expandedIssueId === issue.id ? null : issue.id)
              }
            >
              <Text style={styles.buttonText}>
                {expandedIssueId === issue.id ? "Hide Details" : "View Full Details"}
              </Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      <TouchableOpacity
        style={styles.blackButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>

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
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111111",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 16,
  },
  issueTitle: {
    fontSize: 25,
    fontWeight: "900",
    color: "#111111",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#111111",
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: "#444444",
    marginBottom: 5,
  },
  statusText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#D72638",
    marginVertical: 12,
  },
  issueImage: {
    width: "100%",
    height: 190,
    borderRadius: 14,
    marginTop: 8,
    marginBottom: 10,
  },
  noPhotoText: {
    color: "#777777",
    fontSize: 15,
    fontStyle: "italic",
    marginBottom: 8,
  },
  assignedText: {
    color: "#2EAD4B",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 12,
  },
  notAssignedText: {
    color: "#777777",
    fontSize: 16,
    fontStyle: "italic",
    marginTop: 12,
  },
  commentText: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 12,
  },
  blackButton: {
    backgroundColor: "#111111",
    padding: 16,
    borderRadius: 13,
    alignItems: "center",
    marginTop: 12,
  },
  redButton: {
    backgroundColor: "#D72638",
    padding: 16,
    borderRadius: 13,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 18,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
});