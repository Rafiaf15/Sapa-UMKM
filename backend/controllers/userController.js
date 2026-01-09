const User = require("../models/User");
const bcrypt = require("bcrypt");

/* =========================
   GET ALL USERS
========================= */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("ERROR GET USERS:", error);
    res.status(500).json({ error: "Gagal mendapatkan data pengguna" });
  }
};

/* =========================
   GET USER BY ID
========================= */
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json(user);
  } catch (error) {
    console.error("ERROR GET USER BY ID:", error);
    res.status(500).json({ error: "Gagal mendapatkan data pengguna" });
  }
};

/* =========================
   CREATE USER (REGISTER)
========================= */
exports.createUser = async (req, res) => {
  try {
    console.log("CREATE USER BODY:", req.body);

    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Nama, email, dan password harus diisi",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password minimal 6 karakter",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        error: "Email sudah terdaftar",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      phone: phone || "",
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("ERROR CREATE USER:", error);
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   LOGIN USER
========================= */
exports.login = async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email dan password harus diisi",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        error: "Email atau password salah",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        error: "Email atau password salah",
      });
    }

    res.json({
      message: "Login berhasil",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("ERROR LOGIN:", error);
    res.status(500).json({ error: "Gagal login" });
  }
};

/* =========================
   UPDATE USER
========================= */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("ERROR UPDATE USER:", error);
    res.status(500).json({ error: "Gagal update user" });
  }
};

/* =========================
   DELETE USER
========================= */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json({ message: "User berhasil dihapus" });
  } catch (error) {
    console.error("ERROR DELETE USER:", error);
    res.status(500).json({ error: "Gagal menghapus user" });
  }
};
