import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export function registerUser(req, res) {
  const data = req.body;

  data.password = bcrypt.hashSync(data.password, 10);

  const newUser = new User(data);

  newUser
    .save()
    .then(() => {
      res.status(201).json({ message: "User registered successfully" });
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

        const token = jwt.sign({
          firstname: user.firstName,
          lastname: user.lastName,
          email: user.email,
          role: user.role
        }, "secretkey" );


        res.json({ message: "Login successful", token: token });
      } else {
        res.status(401).json({ message: "Invalid password" });
      }
    }
  });
}
