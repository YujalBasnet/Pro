import { pool } from "../config/db.js";

// @desc    Create a new service request
// @route   POST /api/requests
// @access  Customer
export const createRequest = async (req, res) => {
  const customerId = req.user.id;
  const { service, location, description, mechanicId } = req.body;

  if (!service || !location || !mechanicId) {
    return res.status(400).json({ message: "Please provide service, location, and mechanic" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO requests (customer_id, mechanic_id, service, location, description) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [customerId, mechanicId, service, location, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all service requests for a customer
// @route   GET /api/requests/user
// @access  Customer
export const getUserRequests = async (req, res) => {
  const customerId = req.user.id;
  try {
    const result = await pool.query(
      "SELECT r.id, r.service, r.location, r.description, r.status, m.id AS mechanic_id, u.full_name AS mechanic_name FROM requests r JOIN mechanics m ON r.mechanic_id = m.id JOIN users u ON m.user_id = u.id WHERE r.customer_id=$1 ORDER BY r.created_at DESC",
      [customerId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update service request status (optional admin/mechanic)
// @route   PUT /api/requests/:id/status
// @access  Mechanic/Admin
export const updateRequestStatus = async (req, res) => {
  const requestId = req.params.id;
  const { status } = req.body;

  try {
    const result = await pool.query(
      "UPDATE requests SET status=$1 WHERE id=$2 RETURNING *",
      [status, requestId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};