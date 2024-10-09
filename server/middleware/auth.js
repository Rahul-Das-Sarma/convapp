import jwt from "jsonwebtoken";
import User from "../models/user.js";

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).send("Authentication Invalid 1");
  }

  let token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.userId).select("-password");

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).send({
        message: "Jwt token expired!",
        logout: true,
      });
    } else {
      res.status(401).send("Authentication Invalid 2");
    }
    console.log(error);
  }
};

export default auth;
