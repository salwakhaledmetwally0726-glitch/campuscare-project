const supabase = require("../config/supabase");

const addComment = async (req, res) => {
  try {
    const { issue_id, comment_text } = req.body;

    if (!issue_id || !comment_text) {
      return res.status(400).json({
        message: "Issue ID and comment text are required",
      });
    }

    const { data, error } = await supabase
      .from("comments")
      .insert([
        {
          issue_id,
          user_id: req.user.id,
          comment_text,
        },
      ])
      .select();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(201).json({
      message: "Comment added successfully",
      comment: data[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getIssueComments = async (req, res) => {
  try {
    const { issueId } = req.params;

    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("issue_id", issueId)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json({
      message: "Comments retrieved successfully",
      comments: data,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addComment,
  getIssueComments,
};