import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "6d" });

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 6 * 24 * 60 * 60 * 1000, // match 6d
    sameSite: "lax", // changed from "strict" for smoother local dev
    secure: process.env.NODE_ENV === "production", // send over HTTPS only in production
  });

  return token;
};
