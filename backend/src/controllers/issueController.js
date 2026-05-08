const supabase = require("../config/supabase");

const createIssue = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      building,
      floor,
      room,
      photo_url,
    } = req.body;

    if (!title || !description || !category || !building || !floor || !room) {
      return res.status(400).json({
        error:
          "Title, description, category, building, floor, and room are required",
      });
    }

    const location = `${building}, Floor ${floor}, Room ${room}`;

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
          location,
          photo_url,
          status: "Pending",
          created_by: req.user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(201).json({
      message: "Issue created successfully",
      issue: data,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const getAllIssues = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(200).json({
      message: "All issues retrieved successfully",
      issues: data,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const getMyIssues = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .eq("created_by", req.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(200).json({
      message: "My issues retrieved successfully",
      issues: data,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        error: "Status is required",
      });
    }

    const { data, error } = await supabase
      .from("issues")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(200).json({
      message: "Issue status updated successfully",
      issue: data,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  createIssue,
  getAllIssues,
  getMyIssues,
  updateIssueStatus,
};