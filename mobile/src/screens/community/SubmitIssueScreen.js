import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../api/api";

export default function SubmitIssueScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [room, setRoom] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmitIssue = async () => {
    if (!title || !category || !building || !floor || !room || !description) {
      Alert.alert("Missing Data", "Please fill all issue fields.");
      return;
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Not Logged In", "Please login again.");
        navigation.navigate("Login");
        return;
      }

      const response = await API.post(
        "/issues",
        {
          title,
          description,
          category,
          building,
          floor,
          room,
          photo_url: "test.jpg",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", response.data.message || "Issue submitted successfully");

      setTitle("");
      setCategory("");
      setBuilding("");
      setFloor("");
      setRoom("");
      setDescription("");

      navigation.navigate("MyIssues");
    } catch (error) {
      console.log("Submit issue error:", error.response?.data || error.message);

      Alert.alert(
        "Submit Failed",
        error.response?.data?.message || "Could not submit issue."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Report New Issue</Text>

      <TextInput
        style={styles.input}
        placeholder="Issue Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />

      <TextInput
        style={styles.input}
        placeholder="Building"
        value={building}
        onChangeText={setBuilding}
      />

      <TextInput
        style={styles.input}
        placeholder="Floor"
        value={floor}
        onChangeText={setFloor}
      />

      <TextInput
        style={styles.input}
        placeholder="Room"
        value={room}
        onChangeText={setRoom}
      />

      <TextInput
        style={styles.textArea}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline={true}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmitIssue}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Submit Issue</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("CommunityDashboard")}>
        <Text style={styles.back}>Back to Dashboard</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 25,
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
    height: 110,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    marginTop: 8,
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 17,
  },
  back: {
    marginTop: 20,
    textAlign: "center",
    color: "#007bff",
    fontSize: 16,
  },
});