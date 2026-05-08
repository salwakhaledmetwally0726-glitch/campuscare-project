import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../api/api";

export default function WorkerDashboard({ navigation }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIssues = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Not Logged In", "Please login again.");
        navigation.navigate("Login");
        return;
      }

      const response = await API.get("/issues", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIssues(response.data.issues || []);
    } catch (error) {
      Alert.alert("Error", "Could not load assigned issues.");
    } finally {
      setLoading(false);
    }
  };

  const updateWorkerStatus = async (issueId, newStatus) => {
    try {
      const token = await AsyncStorage.getItem("token");

      await API.put(
        `/issues/${issueId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", `Issue marked as ${newStatus}`);
      fetchIssues();
    } catch (error) {
      Alert.alert("Error", "Could not update issue status.");
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#28a745" />
        <Text style={styles.loadingText}>Loading assigned issues...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Worker Dashboard</Text>
      <Text style={styles.subtitle}>Assigned Issues</Text>

      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate("Profile")}
      >
        <Text style={styles.profileButtonText}>Profile</Text>
      </TouchableOpacity>

      <FlatList
        data={issues}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.issueTitle}>{item.title}</Text>

            <Text style={styles.text}>Category: {item.category}</Text>
            <Text style={styles.text}>Building: {item.building}</Text>
            <Text style={styles.text}>Floor: {item.floor}</Text>
            <Text style={styles.text}>Room: {item.room}</Text>
            <Text style={styles.text}>Description: {item.description}</Text>

            <Text style={styles.status}>Current Status: {item.status}</Text>

            <TouchableOpacity
              style={styles.progressButton}
              onPress={() => updateWorkerStatus(item.id, "In Progress")}
            >
              <Text style={styles.buttonText}>Mark In Progress</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resolvedButton}
              onPress={() => updateWorkerStatus(item.id, "Resolved")}
            >
              <Text style={styles.buttonText}>Mark Resolved</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  loadingText: {
    marginTop: 10,
    color: "#555555",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666666",
    marginBottom: 15,
  },
  profileButton: {
    backgroundColor: "#222222",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },
  profileButtonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  issueTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    marginBottom: 4,
    color: "#444444",
  },
  status: {
    marginTop: 10,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: "bold",
    color: "#28a745",
  },
  progressButton: {
    backgroundColor: "#f0ad4e",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  resolvedButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
  },
});