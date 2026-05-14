import React, { useEffect, useState } from "react";
import {
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  Image,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../api/api";

export default function WorkerDashboard({ navigation }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState({});
  const [comments, setComments] = useState({});
  const [expandedIssues, setExpandedIssues] = useState({});

  const getToken = async () => {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      Alert.alert("Session Expired", "Please login again.");
      navigation.navigate("Login");
      return null;
    }

    return token;
  };

  const refreshAssignedIssues = async () => {
    try {
      setLoading(true);

      const token = await getToken();
      if (!token) return;

      const response = await API.get("/issues/assigned", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIssues(response.data.issues || []);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.error || "Failed to load assigned issues");
    } finally {
      setLoading(false);
    }
  };

  const toggleDetails = (issueId) => {
    setExpandedIssues({
      ...expandedIssues,
      [issueId]: !expandedIssues[issueId],
    });
  };

  const updateStatus = async (issueId, status) => {
    try {
      const token = await getToken();
      if (!token) return;

      await API.put(
        `/issues/${issueId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", `Issue marked as ${status}`);
      refreshAssignedIssues();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.error || "Failed to update issue status");
    }
  };

  const pickCompletionPhoto = async (issueId) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permission.status !== "granted") {
      Alert.alert("Permission Required", "Please allow photo access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setSelectedImages({
        ...selectedImages,
        [issueId]: result.assets[0].uri,
      });
    }
  };

  const uploadCompletionPhoto = async (issueId) => {
    try {
      const token = await getToken();
      if (!token) return;

      const imageUri = selectedImages[issueId];
      const workerComment = comments[issueId] || "Fixed successfully by worker";

      if (!imageUri) {
        Alert.alert("Missing Photo", "Please choose a completion photo first.");
        return;
      }

      const formData = new FormData();

      formData.append("worker_comment", workerComment);
      formData.append("photo", {
        uri: imageUri,
        name: `completion-${Date.now()}.jpg`,
        type: "image/jpeg",
      });

      await API.post(`/issues/${issueId}/photo`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Success", "Completion photo uploaded and issue resolved.");

      setSelectedImages({
        ...selectedImages,
        [issueId]: null,
      });

      setComments({
        ...comments,
        [issueId]: "",
      });

      refreshAssignedIssues();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.error || "Failed to upload completion photo");
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    navigation.navigate("Login");
  };

  useEffect(() => {
    refreshAssignedIssues();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Worker Dashboard</Text>
      <Text style={styles.subtitle}>Assigned Issues</Text>

      <TouchableOpacity style={styles.refreshBtn} onPress={refreshAssignedIssues}>
        <Text style={styles.btnText}>Refresh Assigned Issues</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#0F172A" />
      ) : issues.length === 0 ? (
        <Text style={styles.emptyText}>No assigned issues found.</Text>
      ) : (
        issues.map((issue) => (
          <View key={issue.id} style={styles.card}>
            <Text style={styles.issueTitle}>{issue.title}</Text>
            <Text style={styles.text}>Category: {issue.category}</Text>
            <Text style={styles.status}>Status: {issue.status || "Pending"}</Text>

            <TouchableOpacity
              style={styles.detailsBtn}
              onPress={() => toggleDetails(issue.id)}
            >
              <Text style={styles.btnText}>
                {expandedIssues[issue.id] ? "Hide Full Details" : "View Full Details"}
              </Text>
            </TouchableOpacity>

            {expandedIssues[issue.id] && (
              <View style={styles.detailsBox}>
                <Text style={styles.detailsTitle}>Issue Full Details</Text>

                <Text style={styles.detailText}>Issue ID: {issue.id}</Text>
                <Text style={styles.detailText}>Title: {issue.title}</Text>
                <Text style={styles.detailText}>Category: {issue.category}</Text>
                <Text style={styles.detailText}>Description: {issue.description}</Text>
                <Text style={styles.detailText}>Building: {issue.building}</Text>
                <Text style={styles.detailText}>Floor: {issue.floor}</Text>
                <Text style={styles.detailText}>Room: {issue.room}</Text>
                <Text style={styles.detailText}>Status: {issue.status}</Text>
                <Text style={styles.detailText}>Created By: {issue.created_by}</Text>
                <Text style={styles.detailText}>
                  Assigned To: {issue.assigned_to || "Not assigned"}
                </Text>
                <Text style={styles.detailText}>
                  Worker Comment: {issue.worker_comment || "No comment yet"}
                </Text>
                <Text style={styles.detailText}>
                  Created At: {issue.created_at || "N/A"}
                </Text>

                {issue.photo_url ? (
                  <>
                    <Text style={styles.imageLabel}>Issue Photo:</Text>
                    <Image source={{ uri: issue.photo_url }} style={styles.issueImage} />
                  </>
                ) : (
                  <Text style={styles.noImage}>No issue photo available</Text>
                )}

                {issue.completion_photo_url ? (
                  <>
                    <Text style={styles.imageLabel}>Completion Photo:</Text>
                    <Image
                      source={{ uri: issue.completion_photo_url }}
                      style={styles.issueImage}
                    />
                  </>
                ) : (
                  <Text style={styles.noImage}>No completion photo yet</Text>
                )}
              </View>
            )}

            <TouchableOpacity
              style={[styles.statusBtn, styles.blue]}
              onPress={() => updateStatus(issue.id, "In Progress")}
            >
              <Text style={styles.btnText}>Mark In Progress</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statusBtn, styles.green]}
              onPress={() => updateStatus(issue.id, "Resolved")}
            >
              <Text style={styles.btnText}>Mark Resolved</Text>
            </TouchableOpacity>

            <Text style={styles.section}>Completion Photo</Text>

            <TextInput
              style={styles.input}
              placeholder="Worker comment"
              value={comments[issue.id] || ""}
              onChangeText={(text) =>
                setComments({
                  ...comments,
                  [issue.id]: text,
                })
              }
            />

            <TouchableOpacity
              style={styles.photoBtn}
              onPress={() => pickCompletionPhoto(issue.id)}
            >
              <Text style={styles.btnText}>Choose Completion Photo</Text>
            </TouchableOpacity>

            {selectedImages[issue.id] ? (
              <Image source={{ uri: selectedImages[issue.id] }} style={styles.preview} />
            ) : (
              <Text style={styles.noPhoto}>No completion photo selected</Text>
            )}

            <TouchableOpacity
              style={styles.uploadBtn}
              onPress={() => uploadCompletionPhoto(issue.id)}
            >
              <Text style={styles.btnText}>Upload Completion Photo</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 22, backgroundColor: "#F8FAFC" },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    color: "#64748B",
    marginBottom: 15,
  },
  refreshBtn: {
    backgroundColor: "#0F172A",
    padding: 14,
    borderRadius: 10,
    marginBottom: 18,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    color: "#64748B",
    marginTop: 30,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  issueTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0F172A",
  },
  text: {
    fontSize: 16,
    color: "#334155",
    marginBottom: 4,
  },
  status: {
    fontSize: 18,
    color: "#1D4ED8",
    fontWeight: "bold",
    marginVertical: 10,
  },
  section: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 8,
    color: "#0F172A",
  },
  statusBtn: {
    padding: 13,
    borderRadius: 10,
    marginBottom: 8,
  },
  blue: { backgroundColor: "#2563EB" },
  green: { backgroundColor: "#059669" },
  photoBtn: {
    backgroundColor: "#475569",
    padding: 13,
    borderRadius: 10,
    marginBottom: 8,
  },
  uploadBtn: {
    backgroundColor: "#0F172A",
    padding: 13,
    borderRadius: 10,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  preview: {
    width: "100%",
    height: 160,
    borderRadius: 10,
    marginBottom: 10,
  },
  noPhoto: {
    color: "#64748B",
    fontStyle: "italic",
    marginBottom: 10,
  },
  logoutBtn: {
    backgroundColor: "#020617",
    padding: 14,
    borderRadius: 10,
    marginBottom: 30,
  },
  btnText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  detailsBtn: {
    backgroundColor: "#475569",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  detailsBox: {
    backgroundColor: "#F1F5F9",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    marginBottom: 10,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0F172A",
  },
  detailText: {
    fontSize: 14,
    color: "#334155",
    marginBottom: 4,
  },
  imageLabel: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 6,
    color: "#0F172A",
  },
  issueImage: {
    width: "100%",
    height: 170,
    borderRadius: 10,
    marginBottom: 8,
  },
  noImage: {
    color: "#64748B",
    fontStyle: "italic",
    marginTop: 8,
  },
});