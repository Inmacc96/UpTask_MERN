import User from "../models/User.js";
import generateId from "../helpers/generateId.js";
import generateJWT from "../helpers/generateJWT.js";

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
  const { email, password } = req.body;

  //Check if the user exists
  const user = await User.findOne({
    email,
  });

  if (!user) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  //Check if the user is confirmed
  if (!user.confirmed) {
    const error = new Error("Tu Cuenta no ha sido confirmada");
    return res.status(404).json({ msg: error.message });
  }

  //Check his password
  if (await user.checkPassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateJWT(user._id),
    });
  } else {
    const error = new Error("El Password es Incorrecto");
    return res.status(404).json({ msg: error.message });
  }
};

const confirmUser = async (req, res) => {
  const { token } = req.params;
  const userConfirm = await User.findOne({ token }); //Check if there is a user with that token
  if (!userConfirm) {
    const error = new Error("Token no válido");
    return res.status(404).json({ msg: error.message });
  }

  try {
    userConfirm.confirmed = true;
    userConfirm.token = "";
    console.log(userConfirm);
    await userConfirm.save(); // Save changes bbdd.
    res.json({ msg: "Usuario Confirmado Correctamente" });
  } catch (error) {
    console.log(error);
  }
  console.log(userConfirm);
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  //Check if the user exists
  const user = await User.findOne({
    email,
  });

  if (!user) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  try {
    user.token = generateId();
    await user.save();
    res.json({ msg: "Hemos enviado un email con las instrucciones" });
  } catch (error) {
    console.log(error);
  }
};

export { createUser, authenticateUser, confirmUser, forgetPassword };
