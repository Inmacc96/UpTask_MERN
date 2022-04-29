import User from "../models/User.js";

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
    const storedUsed = await user.save();
    res.json(storedUsed);
  } catch (error) {
    console.log(error);
  }
};

export { createUser };
