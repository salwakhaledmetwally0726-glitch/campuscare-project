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

export default function MyIssuesScreen({ navigation }) {
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

      const response = await API.get("/issues/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);

      setIssues(response.data.issues || []);
    } catch (error) {
      console.log(
        "Fetch Issues Error:",
        error.response?.data || error.message
      );

      Alert.alert("Error", "Could not load issues.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10 }}>Loading Issues...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Issues</Text>

      {issues.length === 0 ? (
        <Text style={styles.emptyText}>No issues found.</Text>
      ) : (
        <FlatList
          data={issues}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.issueTitle}>{item.title}</Text>

              <Text style={styles.text}>
                Category: {item.category}
              </Text>

              <Text style={styles.text}>
                Building: {item.building}
              </Text>

              <Text style={styles.text}>
                Floor: {item.floor}
              </Text>

              <Text style={styles.text}>
                Room: {item.room}
              </Text>

              <Text style={styles.text}>
                Description: {item.description}
              </Text>

              <Text style={styles.status}>
                Status: {item.status}
              </Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("CommunityDashboard")
        }
      >
        <Text style={styles.buttonText}>
          Back To Dashboard
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 18,
    color: "#666",
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
    color: "#444",
  },

  status: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
  },

  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },

  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
