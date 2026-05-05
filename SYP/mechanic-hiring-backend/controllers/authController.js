const User = require('../models/User');
const Mechanic = require('../models/Mechanic');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role, experience, specialization, bio, location } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      isApproved: role === 'customer' ? true : false,
    });

    await user.save();

    // If registering as mechanic, create mechanic profile
    if (role === 'mechanic') {
      const mechanic = new Mechanic({
        userId: user._id,
        name,
        email,
        phone,
        experience: experience || 0,
        specialization: specialization || [],
        bio: bio || '',
        location: location || '',
        approvalStatus: 'pending',
      });

      await mechanic.save();
    }

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let profileData = { user };

    // If mechanic, also fetch mechanic details
    if (user.role === 'mechanic') {
      const mechanic = await Mechanic.findOne({ userId: user._id });
      profileData.mechanic = mechanic;
    }

    res.json({
      message: 'Profile fetched successfully',
      data: profileData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};