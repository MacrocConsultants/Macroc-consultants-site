const User = require("../models/User");

exports.getUsers = async (req, res) => {
  try {
    const filter = req.query.role ? { role: req.query.role } : {};
    const users = await User.find(filter).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ❌ Prevent deleting self (important)
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    await user.deleteOne();

    return res.status(200).json({
      message: "User deleted successfully",
    });

  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    return res.status(500).json({
      message: "Server error while deleting user",
    });
  }
};