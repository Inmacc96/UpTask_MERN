import jwt from "jsonwebtoken";

const generateJWT = (id) => {
  //.sign genera un JWT
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export default generateJWT;
