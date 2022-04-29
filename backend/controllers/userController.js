import User from "../models/User.js";
import generateId from "../helpers/generateId.js";

const createUser = async (req, res) => {
  // Evitar registros duplicados
  const { email } = req.body;
  const userExists = await User.findOne({
    email,
  });
  if (userExists) {
    const error = new Error("Usuario ya registrado");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const user = new User(req.body);
    user.token = generateId();
    const storedUsed = await user.save();
    res.json(storedUsed);
  } catch (error) {
    console.log(error);
  }
};

const authenticateUser = async (req, res) => {
    
};

export { createUser, authenticateUser };
