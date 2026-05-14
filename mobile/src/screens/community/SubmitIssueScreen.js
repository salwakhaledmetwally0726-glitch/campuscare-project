import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../api/api";

export default function SubmitIssueScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [room, setRoom] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
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
      setImageUri(result.assets[0].uri);
    }
  };

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

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("building", building);
      formData.append("floor", floor);
      formData.append("room", room);

      if (imageUri) {
        formData.append("photo", {
          uri: imageUri,
          name: `issue-${Date.now()}.jpg`,
          type: "image/jpeg",
        });
      }

      const response = await API.post("/issues", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert(
        "Success",
        response.data.message || "Issue submitted successfully"
      );

      setTitle("");
      setCategory("");
      setBuilding("");
      setFloor("");
      setRoom("");
      setDescription("");
      setImageUri(null);

      navigation.navigate("MyIssues");
    } catch (error) {
      console.log("Submit issue error:", error.response?.data || error.message);
      Alert.alert(
        "Submit Failed",
        error.response?.data?.error || "Could not submit issue."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Report New Issue</Text>

      <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Category" value={category} onChangeText={setCategory} />
      <TextInput style={styles.input} placeholder="Building" value={building} onChangeText={setBuilding} />
      <TextInput style={styles.input} placeholder="Floor" value={floor} onChangeText={setFloor} />
      <TextInput style={styles.input} placeholder="Room" value={room} onChangeText={setRoom} />

      <TextInput
        style={styles.textArea}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>Choose Issue Photo</Text>
      </TouchableOpacity>

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.previewImage} />
      ) : (
        <Text style={styles.noImageText}>No image selected</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmitIssue} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit Issue</Text>}
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
  imageButton: {
    backgroundColor: "#222222",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  imageButtonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
  },
  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 15,
  },
  noImageText: {
    textAlign: "center",
    color: "#777777",
    marginBottom: 15,
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