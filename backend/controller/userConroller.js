import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export function registerUser(req, res) {
  const data = req.body;

  data.password = bcrypt.hashSync(data.password, 10);

  const newUser = new User(data);

  newUser
    .save()
    .then((savedUser) => {
      const token = jwt.sign(
        {
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          email: savedUser.email,
          role: savedUser.role,
        },
        process.env.JWT_SECRET,
      );

      res.status(201).json({
        message: "User registered successfully",
        token: token,
        user: {
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          email: savedUser.email,
          role: savedUser.role,
        },
      });
    })
    .catch((error) => {
      console.error("Registration error:", error);
      res.status(500).json({ error: error.message });
    });
}

export function loginUser(req, res) {
  const data = req.body;

  User.findOne({
    email: data.email,
  }).then((user) => {
    if (user == null) {
      return res.status(404).json({
        message: "User not found",
      });
    } else {
      const passwordMatch = bcrypt.compareSync(data.password, user.password);

      if (passwordMatch) {
        const token = jwt.sign(
          {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
          },
          process.env.JWT_SECRET,
        );

        res.json({
          message: "Login successful",
          token: token,
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
          },
        });
      } else {
        res.status(401).json({ message: "Invalid password" });
      }
    }
  });
}
