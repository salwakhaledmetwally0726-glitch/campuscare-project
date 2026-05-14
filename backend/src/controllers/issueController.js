const supabase = require("../config/supabase");

const getUploadedFile = (req) => {
  if (req.file) return req.file;
  if (req.files && req.files.length > 0) return req.files[0];
  return null;
};

const uploadToSupabase = async (file, folderName) => {
  const fileName = `${folderName}/${Date.now()}-${file.originalname || "photo.png"}`;

  const { error } = await supabase.storage
    .from("issue-photos")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype || "image/png",
      upsert: true,
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("issue-photos").getPublicUrl(fileName);
  return data.publicUrl;
};

const createIssue = async (req, res) => {
  try {
    const { title, description, category, building, floor, room } = req.body;
    const uploadedFile = getUploadedFile(req);

    let photo_url = null;
    if (uploadedFile) {
      photo_url = await uploadToSupabase(uploadedFile, "issue-submissions");
    }

    const { data, error } = await supabase
      .from("issues")
      .insert([
        {
          title,
          description,
          category,
          building,
          floor,
          room,
          photo_url,
          status: "Pending",
          created_by: req.user.id,
        },
      ])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    return res.status(201).json({
      message: "Issue created successfully with cloud photo upload",
      issue: data,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllIssues = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({
      message: "All issues retrieved successfully",
      issues: data || [],
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getMyIssues = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .eq("created_by", req.user.id)
      .order("created_at", { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({
      message: "My issues retrieved successfully",
      issues: data || [],
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getIssueById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) return res.status(404).json({ error: error.message });

    return res.status(200).json({
      message: "Issue details retrieved successfully",
      issue: data,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateIssueStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const { data, error } = await supabase
      .from("issues")
      .update({ status })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({
      message: "Issue status updated successfully",
      issue: data,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const assignIssue = async (req, res) => {
  try {
    const { worker_id } = req.body;

    const { data, error } = await supabase
      .from("issues")
      .update({
        assigned_to: worker_id,
        status: "In Progress",
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({
      message: "Issue assigned to worker successfully",
      issue: data,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAssignedIssues = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .eq("assigned_to", req.user.id)
      .order("created_at", { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({
      message: "Assigned issues retrieved successfully",
      issues: data || [],
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { comment } = req.body;

    const { data, error } = await supabase
      .from("comments")
      .insert([
        {
          issue_id: req.params.id,
          user_id: req.user.id,
          comment,
        },
      ])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    return res.status(201).json({
      message: "Comment added successfully",
      comment: data,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const uploadCompletionPhoto = async (req, res) => {
  try {
    const worker_comment = req.body?.worker_comment || "Fixed successfully by worker";
    const uploadedFile = getUploadedFile(req);

    if (!uploadedFile) {
      return res.status(400).json({ error: "Completion photo is required" });
    }

    const completion_photo_url = await uploadToSupabase(
      uploadedFile,
      "completion-photos"
    );

    const { data, error } = await supabase
      .from("issues")
      .update({
        completion_photo_url,
        worker_comment,
        status: "Resolved",
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({
      message: "Completion photo uploaded successfully and issue resolved",
      issue: data,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const closeIssue = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("issues")
      .update({ status: "Closed" })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({
      message: "Issue closed successfully",
      issue: data,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteIssue = async (req, res) => {
  try {
    const { error } = await supabase
      .from("issues")
      .delete()
      .eq("id", req.params.id);

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({
      message: "Issue deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getWorkers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, role")
      .or("role.eq.worker,role.eq.Worker,role.eq.WORKER");

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({
      message: "Workers retrieved successfully",
      workers: data || [],
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createIssue,
  getAllIssues,
  getMyIssues,
  getIssueById,
  updateIssueStatus,
  assignIssue,
  getAssignedIssues,
  addComment,
  uploadCompletionPhoto,
  closeIssue,
  deleteIssue,
  getWorkers,
};