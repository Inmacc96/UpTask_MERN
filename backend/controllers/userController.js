import User from "../models/User.js";

const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    const storedUsed = await user.save();
    res.json(storedUsed);
  } catch (error) {
    console.log(error);
  }
};

export { createUser };
