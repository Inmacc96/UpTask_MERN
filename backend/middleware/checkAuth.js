import jwt from "jsonwebtoken";
import User from "../models/User.js";

const checkAuth = async (req, res, next) => {
  // Next nos permite irnos al siguiente middleware. Es decir, que se vaya a profile()

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select(
        "-password -confirmed -token -createdAt -updatedAt -__v"
      );

      return next();
    } catch (error) {
      // En caso de que haya expirado el JWT
      return res.status(404).json({ msg: error.message });
    }
  }

  if (!token) {
    const error = new Error("Token no válido");
    return res.status(401).json({ msg: error.message });
  }
  next();
};

export default checkAuth;
