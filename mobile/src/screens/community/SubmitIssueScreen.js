import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import API from "../../api/api";

export default function SubmitIssueScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [room, setRoom] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0]);
    }
  };

  const submitIssue = async () => {
    if (!title || !description || !category || !building || !floor || !room) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("building", building);
      formData.append("floor", floor);
      formData.append("room", room);

      if (photo) {
        formData.append("photo", {
          uri: photo.uri,
          name: "issue-photo.jpg",
          type: "image/jpeg",
        });
      }

      await API.post("/issues", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Success", "Issue submitted successfully.");
      navigation.navigate("MyIssues");
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to submit issue"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>
          GIU <Text style={styles.redText}>Campus</Text>
          <Text style={styles.goldText}>Care</Text>
        </Text>
        <Text style={styles.subtitle}>Submit New Issue</Text>

        <View style={styles.flagLine}>
          <View style={styles.blackLine} />
          <View style={styles.redLine} />
          <View style={styles.goldLine} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Issue Information</Text>

        <TextInput
          style={styles.input}
          placeholder="Issue title"
          placeholderTextColor="#999999"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Issue description"
          placeholderTextColor="#999999"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="Category e.g. Furniture, Technical, Cleaning"
          placeholderTextColor="#999999"
          value={category}
          onChangeText={setCategory}
        />

        <Text style={styles.sectionTitle}>Location</Text>

        <TextInput
          style={styles.input}
          placeholder="Building"
          placeholderTextColor="#999999"
          value={building}
          onChangeText={setBuilding}
        />

        <TextInput
          style={styles.input}
          placeholder="Floor"
          placeholderTextColor="#999999"
          value={floor}
          onChangeText={setFloor}
        />

        <TextInput
          style={styles.input}
          placeholder="Room"
          placeholderTextColor="#999999"
          value={room}
          onChangeText={setRoom}
        />

        <Text style={styles.sectionTitle}>Issue Photo</Text>

        {photo ? (
          <Image source={{ uri: photo.uri }} style={styles.previewImage} />
        ) : (
          <Text style={styles.photoText}>No issue photo selected</Text>
        )}

        <TouchableOpacity style={styles.goldButton} onPress={pickPhoto}>
          <Text style={styles.buttonText}>Choose Issue Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.redButton}
          onPress={submitIssue}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Submitting..." : "Submit Issue"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.blackButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 35,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111111",
    marginBottom: 12,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 13,
    padding: 15,
    fontSize: 16,
    marginBottom: 14,
    color: "#111111",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  previewImage: {
    width: "100%",
    height: 190,
    borderRadius: 14,
    marginBottom: 12,
  },
  photoText: {
    color: "#666666",
    fontSize: 15,
    fontStyle: "italic",
    marginBottom: 12,
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
    marginTop: 12,
  },
  goldButton: {
    backgroundColor: "#F4B400",
    padding: 16,
    borderRadius: 13,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
});