import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import API from "../../api/api";

export default function WorkerDashboard({ navigation }) {
  const [issues, setIssues] = useState([]);
  const [expandedIssueId, setExpandedIssueId] = useState(null);
  const [comments, setComments] = useState({});
  const [photos, setPhotos] = useState({});
  const [loading, setLoading] = useState(false);

  const loadAssignedIssues = async () => {
    try {
      setLoading(true);
      const res = await API.get("/issues/assigned");
      setIssues(res.data.issues || []);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.error || "Failed to load assigned issues");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (issueId, status) => {
    try {
      await API.put(`/issues/${issueId}/status`, { status });
      Alert.alert("Success", `Issue marked as ${status}`);
      loadAssignedIssues();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.error || "Failed to update status");
    }
  };

  const pickPhoto = async (issueId) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotos({
        ...photos,
        [issueId]: result.assets[0],
      });
    }
  };

  const uploadCompletionPhoto = async (issueId) => {
    try {
      const selectedPhoto = photos[issueId];

      if (!selectedPhoto) {
        Alert.alert("Missing Photo", "Please choose a completion photo first.");
        return;
      }

      const formData = new FormData();

      formData.append("worker_comment", comments[issueId] || "Work completed");

      formData.append("photo", {
        uri: selectedPhoto.uri,
        name: "completion-photo.jpg",
        type: "image/jpeg",
      });

      await API.post(`/issues/${issueId}/photo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Success", "Completion photo uploaded successfully");
      loadAssignedIssues();
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to upload completion photo"
      );
    }
  };

  useEffect(() => {
    loadAssignedIssues();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>
          GIU <Text style={styles.redText}>Campus</Text>
          <Text style={styles.goldText}>Care</Text>
        </Text>
        <Text style={styles.subtitle}>Worker Dashboard</Text>

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

      <TouchableOpacity style={styles.redButton} onPress={loadAssignedIssues}>
        <Text style={styles.buttonText}>
          {loading ? "Refreshing..." : "Refresh Assigned Issues"}
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

          <TouchableOpacity
            style={styles.goldButton}
            onPress={() => updateStatus(issue.id, "In Progress")}
          >
            <Text style={styles.buttonText}>Mark In Progress</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.greenButton}
            onPress={() => updateStatus(issue.id, "Resolved")}
          >
            <Text style={styles.buttonText}>Mark Resolved</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Completion Photo Upload</Text>

          <TextInput
            style={styles.input}
            placeholder="Worker comment"
            placeholderTextColor="#999999"
            value={comments[issue.id] || ""}
            onChangeText={(text) =>
              setComments({
                ...comments,
                [issue.id]: text,
              })
            }
          />

          <TouchableOpacity
            style={styles.grayButton}
            onPress={() => pickPhoto(issue.id)}
          >
            <Text style={styles.buttonText}>Choose Completion Photo</Text>
          </TouchableOpacity>

          <Text style={styles.photoText}>
            {photos[issue.id]
              ? "Completion photo selected"
              : "No completion photo selected"}
          </Text>

          <TouchableOpacity
            style={styles.blackButton}
            onPress={() => uploadCompletionPhoto(issue.id)}
          >
            <Text style={styles.buttonText}>Upload Completion Photo</Text>
          </TouchableOpacity>
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
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
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
  grayButton: {
    backgroundColor: "#666666",
    padding: 15,
    borderRadius: 13,
    alignItems: "center",
    marginTop: 10,
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
  photoText: {
    color: "#666666",
    fontSize: 15,
    fontStyle: "italic",
    marginTop: 8,
  },
});