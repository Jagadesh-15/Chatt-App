// import { generateToken } from "../lib/util.js";
// import User from "../models/user.model.js";
// import bcrypt from "bcryptjs";
// import cloudinary from "../lib/cloudinary.js";

// export const signup = async (req, res) => {
//   const { fullname, password, email } = req.body;

//   try {
//     if (!fullname || !email || !password) {
//       return res.status(400).json({ message: "All fields must be filled" });
//     }

//     if (password.length < 8) {
//       return res
//         .status(400)
//         .json({ message: "Password must be at least 8 characters" });
//     }

//     const user = await User.findOne({ email });
//     if (user) return res.status(400).json({ message: "Email already exists" });

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = new User({
//       fullname,
//       email,
//       password: hashedPassword,
//     });

//     if (newUser) {
//       generateToken(newUser._id, res);
//       await newUser.save();

//       res.status(201).json({
//         _id: newUser.id,
//         fullname: newUser.fullname,
//         email: newUser.email,
//         profilePic: newUser.profilePic,
//       });
//     } else {
//       res.status(400).json({ message: "Invalid user data!" });
//     }
//   } catch (error) {
//     console.error("Error in signup controller:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export const login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       res.status(400).json({ message: "Invaid Credentials" });
//     }

//     const isPasswordCorrect = await bcrypt.compare(password, user.password);
//     if (!isPasswordCorrect) {
//       res.status(400).json({ message: "Invaid Credentials" });
//     }

//     generateToken(user._id, res);

//     res.status(200).json({
//       _id: user.id,
//       fullname: user.fullname,
//       email: user.email,
//       profilePic: user.profilePic,
//     });
//   } catch (error) {
//     console.error("Error in login controller:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export const logout = (req, res) => {
//   try {
//     res.cookie("jwt", "", { maxAge: 0 });
//     res.status(200).json({ message: "Logged Out Successfully" });
//   } catch (error) {
//     console.error("Error in login controller:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// // export const updateProfile = async (req, res ) => {
// //   try {
// //     const { profilePic } = req.body;
// //     const userId = req.user._id;

// //     if (!profilePic) {
// //       res.status(400).json({ message: "Profile pic is required" });
// //     }
// //     const uploadResponse = await cloudinary.uploader(profilePic);
// //     const updatedUser = await User.findByIdAndUpdate(
// //       userId,
// //       { profilePic: uploadResponse.secure_url },
// //       { new: true }
// //     );

// //     res.status(200).json(updatedUser);
// //   } catch (error) {
// //     console.error("Error in Profilepic upload:", error.message);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };
// export const updateProfile = async (req, res) => {
//   try {
//     const { profilePic } = req.body;
//     const userId = req.user._id;

//     if (!profilePic) {
//       return res.status(400).json({ message: "Profile pic is required" });
//     }

//     // Remove data URI prefix if present
//     let base64Data = profilePic;
//     if (profilePic.startsWith('data:')) {
//       base64Data = profilePic.replace(/^data:image\/\w+;base64,/, '');
//     }

//     // Upload to Cloudinary
//     const uploadResponse = await cloudinary.uploader.upload(
//       `data:image/jpeg;base64,${base64Data}`, 
//       {
//         folder: "user_profiles",
//         resource_type: "image"
//       }
//     );

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { profilePic: uploadResponse.secure_url },
//       { new: true }
//     ).select('-password'); // Exclude password from response

//     return res.status(200).json(updatedUser);
//   } catch (error) {
//     console.error("Error in Profilepic upload:", error);
//     return res.status(500).json({ 
//       message: error.message || "Internal Server Error",
//       details: error.stack 
//     });
//   }
// };

// export const checkAuth = (req, res) => { 
//     try {
//         res.status(200).json(req.user);
//     } catch (error) {
//         console.error("Error in checkAuth controller:", error.message);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };
import { generateToken } from "../lib/util.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
export const signup = async (req, res) => {
  const { fullname, password, email } = req.body;
  try {
    if (!fullname || !email || !password) return res.status(400).json({ message: "All fields must be filled" });
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullname, email, password: hashedPassword });
    generateToken(newUser._id, res);
    await newUser.save();
    res.status(201).json({ _id: newUser.id, fullname: newUser.fullname, email: newUser.email, profilePic: newUser.profilePic });
  } catch (error) {
    console.error("Error in signup:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    generateToken(user._id, res);
    res.status(200).json({ _id: user.id, fullname: user.fullname, email: user.email, profilePic: user.profilePic });
  } catch (error) {
    console.error("Error in login:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged Out Successfully" });
};
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) return res.status(400).json({ message: "Profile pic is required" });
    let base64Data = profilePic.startsWith("data:") ? profilePic.replace(/^data:image\/\w+;base64,/, "") : profilePic;
    const uploadResponse = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64Data}`, { folder: "user_profiles", resource_type: "image" });
    const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true }).select("-password");
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile pic:", error);
    res.status(500).json({ message: error.message });
  }
};
export const checkAuth = (req, res) => {
  res.status(200).json(req.user);
};