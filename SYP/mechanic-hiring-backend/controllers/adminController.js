import { pool } from "../config/db.js";

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
export const getUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, full_name, email, phone, role FROM users ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Admin
export const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await pool.query("DELETE FROM users WHERE id=$1", [userId]);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all mechanics
// @route   GET /api/admin/mechanics
// @access  Admin
export const getMechanics = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT m.id, u.full_name, u.email, u.phone, m.skills, m.experience, m.availability, m.status FROM mechanics m JOIN users u ON m.user_id=u.id ORDER BY m.created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Approve mechanic
// @route   PUT /api/admin/mechanics/:id/approve
// @access  Admin
export const approveMechanic = async (req, res) => {
  const mechanicId = req.params.id;
  try {
    const result = await pool.query(
      "UPDATE mechanics SET status='Approved' WHERE id=$1 RETURNING *",
      [mechanicId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all service requests
// @route   GET /api/admin/requests
// @access  Admin
export const getRequests = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.id, r.service, r.location, r.description, r.status,
              cu.full_name AS customer_name, me.full_name AS mechanic_name
       FROM requests r
       LEFT JOIN users cu ON r.customer_id=cu.id
       LEFT JOIN mechanics m ON r.mechanic_id=m.id
       LEFT JOIN users me ON m.user_id=me.id
       ORDER BY r.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a request
// @route   DELETE /api/admin/requests/:id
// @access  Admin
export const deleteRequest = async (req, res) => {
  const requestId = req.params.id;
  try {
    await pool.query("DELETE FROM requests WHERE id=$1", [requestId]);
    res.json({ message: "Request deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};