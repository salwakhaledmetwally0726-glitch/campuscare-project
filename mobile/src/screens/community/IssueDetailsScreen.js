import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../api/api";

export default function IssueDetailsScreen({ route, navigation }) {
  const { issue } = route.params;

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await API.get(`/comments/${issue.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setComments(response.data.comments || []);
    } catch (error) {
      console.log("Fetch comments error:", error.response?.data || error.message);
    }
  };

  const addComment = async () => {
    if (!commentText.trim()) {
      Alert.alert("Missing Comment", "Please write a comment first.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      await API.post(
        "/comments",
        {
          issue_id: issue.id,
          comment_text: commentText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", "Comment added successfully");

      setCommentText("");
      fetchComments();
    } catch (error) {
      console.log("Add comment error:", error.response?.data || error.message);
      Alert.alert("Error", "Could not add comment.");
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Issue Details</Text>

      <View style={styles.card}>
        <Text style={styles.issueTitle}>{issue.title}</Text>

        {issue.photo_url && issue.photo_url !== "test.jpg" ? (
          <Image source={{ uri: issue.photo_url }} style={styles.image} />
        ) : null}

        <Text style={styles.text}>Category: {issue.category}</Text>
        <Text style={styles.text}>Building: {issue.building}</Text>
        <Text style={styles.text}>Floor: {issue.floor}</Text>
        <Text style={styles.text}>Room: {issue.room}</Text>
        <Text style={styles.text}>Description: {issue.description}</Text>

        <Text style={styles.status}>Current Status: {issue.status}</Text>
      </View>

      <View style={styles.commentBox}>
        <Text style={styles.sectionTitle}>Add Comment</Text>

        <TextInput
          style={styles.commentInput}
          placeholder="Write update/comment..."
          value={commentText}
          onChangeText={setCommentText}
          multiline={true}
        />

        <TouchableOpacity style={styles.commentButton} onPress={addComment}>
          <Text style={styles.commentButtonText}>Submit Comment</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.commentsList}>
        <Text style={styles.sectionTitle}>Comments</Text>

        {comments.length === 0 ? (
          <Text style={styles.noComments}>No comments yet.</Text>
        ) : (
          comments.map((comment) => (
            <View key={comment.id} style={styles.commentCard}>
              <Text style={styles.commentText}>{comment.comment_text}</Text>
              <Text style={styles.commentDate}>
                {new Date(comment.created_at).toLocaleString()}
              </Text>
            </View>
          ))
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  issueTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 15,
  },
  text: {
    fontSize: 17,
    marginBottom: 10,
    color: "#444",
  },
  status: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#007bff",
    marginTop: 12,
  },
  commentBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 15,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    height: 90,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  commentButton: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 10,
  },
  commentButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  commentsList: {
    marginBottom: 18,
  },
  noComments: {
    color: "#777",
    fontSize: 16,
  },
  commentCard: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  commentText: {
    fontSize: 16,
    color: "#333",
  },
  commentDate: {
    fontSize: 12,
    color: "#777",
    marginTop: 6,
  },
  button: {
    backgroundColor: "#1f1f1f",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});