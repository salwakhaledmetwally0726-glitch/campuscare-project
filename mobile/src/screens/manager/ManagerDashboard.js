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

export default function ManagerDashboard({ navigation }) {
  const [issues, setIssues] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [expandedIssueId, setExpandedIssueId] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const issuesRes = await API.get("/issues");
      setIssues(issuesRes.data.issues || []);

      const workersRes = await API.get("/issues/workers");
      setWorkers(workersRes.data.workers || []);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.error || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (issueId, status) => {
    try {
      await API.put(`/issues/${issueId}/status`, { status });
      Alert.alert("Success", `Issue updated to ${status}`);
      loadData();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.error || "Failed to update status");
    }
  };

  const assignWorker = async (issueId, workerId) => {
    try {
      await API.put(`/issues/${issueId}/assign`, {
        worker_id: workerId,
      });

      Alert.alert("Success", "Issue assigned to worker successfully");
      loadData();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.error || "Failed to assign worker");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>
          GIU <Text style={styles.redText}>Campus</Text>
          <Text style={styles.goldText}>Care</Text>
        </Text>
        <Text style={styles.subtitle}>Facility Manager Dashboard</Text>

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

      <TouchableOpacity style={styles.redButton} onPress={loadData}>
        <Text style={styles.buttonText}>
          {loading ? "Refreshing..." : "Refresh Issues & Workers"}
        </Text>
      </TouchableOpacity>

      {issues.map((issue) => (
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

              <Text style={styles.text}>
                Worker Comment: {issue.worker_comment || "No comment yet"}
              </Text>
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

          <Text style={styles.sectionTitle}>Update Status</Text>

          <TouchableOpacity
            style={styles.goldButton}
            onPress={() => updateStatus(issue.id, "In Progress")}
          >
            <Text style={styles.buttonText}>In Progress</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.greenButton}
            onPress={() => updateStatus(issue.id, "Resolved")}
          >
            <Text style={styles.buttonText}>Resolved</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.redButton}
            onPress={() => updateStatus(issue.id, "Closed")}
          >
            <Text style={styles.buttonText}>Closed</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Assign to Worker</Text>

          {workers.length === 0 ? (
            <Text style={styles.errorText}>No workers found.</Text>
          ) : (
            workers.map((worker) => (
              <TouchableOpacity
                key={worker.id}
                style={styles.assignButton}
                onPress={() => assignWorker(issue.id, worker.id)}
              >
                <Text style={styles.buttonText}>
                  {worker.name} - {worker.email}
                </Text>
              </TouchableOpacity>
            ))
          )}

          {issue.assigned_to ? (
            <Text style={styles.assignedText}>Assigned: {issue.assigned_to}</Text>
          ) : (
            <Text style={styles.notAssignedText}>Not assigned yet</Text>
          )}
        </View>
      ))}

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
    padding: 18,
  },
  header: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 22,
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
    marginVertical: 14,
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
  profileButton: {
    backgroundColor: "#F4B400",
    padding: 15,
    borderRadius: 13,
    alignItems: "center",
    marginBottom: 12,
  },
  blackButton: {
    backgroundColor: "#111111",
    padding: 15,
    borderRadius: 13,
    alignItems: "center",
    marginTop: 10,
  },
  redButton: {
    backgroundColor: "#D72638",
    padding: 15,
    borderRadius: 13,
    alignItems: "center",
    marginTop: 10,
  },
  goldButton: {
    backgroundColor: "#F4B400",
    padding: 15,
    borderRadius: 13,
    alignItems: "center",
    marginTop: 10,
  },
  greenButton: {
    backgroundColor: "#2EAD4B",
    padding: 15,
    borderRadius: 13,
    alignItems: "center",
    marginTop: 10,
  },
  assignButton: {
    backgroundColor: "#111111",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  logoutButton: {
    backgroundColor: "#111111",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 40,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },
  assignedText: {
    color: "#2EAD4B",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 14,
  },
  notAssignedText: {
    color: "#777777",
    fontSize: 16,
    fontStyle: "italic",
    marginTop: 14,
  },
  errorText: {
    color: "#D72638",
    fontSize: 16,
    marginTop: 8,
  },
});