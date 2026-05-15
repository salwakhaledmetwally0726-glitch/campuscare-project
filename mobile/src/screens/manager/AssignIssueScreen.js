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

export default function AssignIssueScreen({ route, navigation }) {
  const issueId = route?.params?.issueId || route?.params?.issue?.id;
  const passedIssue = route?.params?.issue || null;

  const [issue, setIssue] = useState(passedIssue);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      if (issueId) {
        const issueResponse = await API.get(`/issues/${issueId}`);
        setIssue(issueResponse.data.issue);
      }

      const workersResponse = await API.get("/issues/workers");
      setWorkers(workersResponse.data.workers || []);
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to load assignment data"
      );
    } finally {
      setLoading(false);
    }
  };

  const assignWorker = async (worker) => {
    if (!issueId) {
      Alert.alert("Error", "Issue ID is missing.");
      return;
    }

    try {
      await API.put(`/issues/${issueId}/assign`, {
        worker_id: worker.id,
      });

      Alert.alert("Success", `Issue assigned to ${worker.name || worker.email}`);
      loadData();
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to assign issue"
      );
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
        <Text style={styles.subtitle}>Assign Issue</Text>

        <View style={styles.flagLine}>
          <View style={styles.blackLine} />
          <View style={styles.redLine} />
          <View style={styles.goldLine} />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#D72638" />
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.issueTitle}>
              {issue?.title || "Selected Issue"}
            </Text>
            <Text style={styles.text}>Category: {issue?.category || "N/A"}</Text>
            <Text style={styles.text}>Status: {issue?.status || "N/A"}</Text>
            <Text style={styles.text}>
              Assigned To: {issue?.assigned_to || "Not assigned yet"}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Available Workers</Text>

            {workers.length === 0 ? (
              <Text style={styles.errorText}>No workers found.</Text>
            ) : (
              workers.map((worker) => (
                <TouchableOpacity
                  key={worker.id}
                  style={styles.redButton}
                  onPress={() => assignWorker(worker)}
                >
                  <Text style={styles.buttonText}>
                    {worker.name || "Worker"} - {worker.email}
                  </Text>
                </TouchableOpacity>
              ))
            )}

            <TouchableOpacity style={styles.goldButton} onPress={loadData}>
              <Text style={styles.buttonText}>Refresh Workers</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.blackButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </>
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111111",
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: "#444444",
    marginBottom: 6,
  },
  errorText: {
    color: "#D72638",
    fontSize: 16,
    marginBottom: 10,
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
    marginTop: 12,
  },
  blackButton: {
    backgroundColor: "#111111",
    padding: 15,
    borderRadius: 13,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },
});
