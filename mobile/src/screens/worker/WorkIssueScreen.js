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
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import API from "../../api/api";

export default function WorkIssueScreen({ route, navigation }) {
  const issueId = route?.params?.issueId || route?.params?.issue?.id;
  const passedIssue = route?.params?.issue || null;

  const [issue, setIssue] = useState(passedIssue);
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState(null);
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
      Alert.alert("Success", `Issue marked as ${status}`);
      loadIssue();
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to update status"
      );
    }
  };

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permission.status !== "granted") {
      Alert.alert("Permission Required", "Please allow photo access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0]);
    }
  };

  const uploadCompletionPhoto = async () => {
    if (!issueId) {
      Alert.alert("Error", "Issue ID is missing.");
      return;
    }

    if (!photo) {
      Alert.alert("Missing Photo", "Please choose a completion photo first.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("worker_comment", comment || "Work completed");

      formData.append("photo", {
        uri: photo.uri,
        name: `completion-${Date.now()}.jpg`,
        type: "image/jpeg",
      });

      await API.post(`/issues/${issueId}/photo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Success", "Completion photo uploaded successfully");
      setComment("");
      setPhoto(null);
      loadIssue();
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to upload completion photo"
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
        <Text style={styles.subtitle}>Work Issue</Text>

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
          <Text style={styles.issueTitle}>{issue?.title || "Assigned Issue"}</Text>
          <Text style={styles.text}>Category: {issue?.category || "N/A"}</Text>
          <Text style={styles.text}>Description: {issue?.description || "N/A"}</Text>
          <Text style={styles.text}>Building: {issue?.building || "N/A"}</Text>
          <Text style={styles.text}>Floor: {issue?.floor || "N/A"}</Text>
          <Text style={styles.text}>Room: {issue?.room || "N/A"}</Text>
          <Text style={styles.statusText}>
            Status: {issue?.status || "Pending"}
          </Text>

          {issue?.photo_url ? (
            <Image source={{ uri: issue.photo_url }} style={styles.image} />
          ) : null}

          <TouchableOpacity
            style={styles.goldButton}
            onPress={() => updateStatus("In Progress")}
          >
            <Text style={styles.buttonText}>Mark In Progress</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.greenButton}
            onPress={() => updateStatus("Resolved")}
          >
            <Text style={styles.buttonText}>Mark Resolved</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Completion Update</Text>

          <TextInput
            style={styles.input}
            placeholder="Worker comment"
            placeholderTextColor="#999999"
            value={comment}
            onChangeText={setComment}
            multiline
          />

          <TouchableOpacity style={styles.grayButton} onPress={pickPhoto}>
            <Text style={styles.buttonText}>Choose Completion Photo</Text>
          </TouchableOpacity>

          {photo ? (
            <Image source={{ uri: photo.uri }} style={styles.image} />
          ) : (
            <Text style={styles.photoText}>No completion photo selected</Text>
          )}

          <TouchableOpacity style={styles.redButton} onPress={uploadCompletionPhoto}>
            <Text style={styles.buttonText}>Upload Completion Photo</Text>
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
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
    minHeight: 80,
    textAlignVertical: "top",
  },
  image: {
    width: "100%",
    height: 190,
    borderRadius: 14,
    marginTop: 12,
    marginBottom: 10,
  },
  photoText: {
    color: "#666666",
    fontSize: 15,
    fontStyle: "italic",
    marginTop: 8,
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
    marginTop: 12,
  },
  grayButton: {
    backgroundColor: "#666666",
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