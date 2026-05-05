import { pool } from "../config/db.js";
const Mechanic = require('../models/Mechanic');

// @desc    Get mechanic profile
// @route   GET /api/mechanics/profile
// @access  Mechanic
export const getProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      "SELECT m.id, m.skills, m.experience, m.availability, m.status, u.full_name, u.email, u.phone FROM mechanics m JOIN users u ON m.user_id = u.id WHERE m.user_id=$1",
      [userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Profile not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update mechanic profile
// @route   PUT /api/mechanics/profile
// @access  Mechanic
export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { skills, experience, availability } = req.body;

  try {
    const result = await pool.query(
      "UPDATE mechanics SET skills=$1, experience=$2, availability=$3 WHERE user_id=$4 RETURNING *",
      [skills, experience, availability, userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all jobs for mechanic
// @route   GET /api/mechanics/jobs
// @access  Mechanic
export const getJobs = async (req, res) => {
  const userId = req.user.id;
  try {
    const mechanicRes = await pool.query("SELECT id FROM mechanics WHERE user_id=$1", [userId]);
    const mechanicId = mechanicRes.rows[0].id;

    const jobs = await pool.query(
      "SELECT r.id, r.service, r.location, r.description, r.status, u.full_name AS customer_name FROM requests r JOIN users u ON r.customer_id = u.id WHERE r.mechanic_id=$1 ORDER BY r.created_at DESC",
      [mechanicId]
    );
    res.json(jobs.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update job status
// @route   PUT /api/mechanics/jobs/:id/status
// @access  Mechanic
export const updateJobStatus = async (req, res) => {
  const jobId = req.params.id;
  const { status } = req.body;

  try {
    const result = await pool.query(
      "UPDATE requests SET status=$1 WHERE id=$2 RETURNING *",
      [status, jobId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all approved mechanics
exports.getAllMechanics = async (req, res) => {
  try {
    const mechanics = await Mechanic.find({ approvalStatus: 'approved', isActive: true })
      .populate('userId', 'name email phone')
      .select('-password');

    res.json({
      message: 'Mechanics fetched successfully',
      data: mechanics,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get mechanic by ID
exports.getMechanicById = async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(req.params.id)
      .populate('userId', 'name email phone');

    if (!mechanic) {
      return res.status(404).json({ message: 'Mechanic not found' });
    }

    res.json({
      message: 'Mechanic fetched successfully',
      data: mechanic,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update mechanic profile
exports.updateMechanicProfile = async (req, res) => {
  try {
    const { experience, specialization, bio, location, isActive } = req.body;

    const mechanic = await Mechanic.findByIdAndUpdate(
      req.params.id,
      { experience, specialization, bio, location, isActive },
      { new: true }
    );

    res.json({
      message: 'Mechanic profile updated successfully',
      data: mechanic,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};