import User from "../models/User.js"; //Es el que interactua directamente con la BD
import generateId from "../helpers/generateId.js";
import generateJWT from "../helpers/generateJWT.js";
import { emailConfirmAccount, emailResetPassword } from "../helpers/email.js";

const createUser = async (req, res) => {
  // Evitar registros duplicados
  const { email } = req.body;
  const userExists = await User.findOne({
    email,
  });
  if (userExists) {
    const error = new Error("Already registered user");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const user = new User(req.body); //Crea una nueva instancia con el modelo usuario y los datos dados
    user.token = generateId();
    await user.save();

    // Enviar el email de confirmación
    emailConfirmAccount({
      email: user.email,
      name: user.name,
      token: user.token,
    });

    res.json({
      msg: "User successfully created, check your email to confirm your account",
    });
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
    const error = new Error("The user doesn't exist");
    return res.status(404).json({ msg: error.message });
  }

  //Check if the user is confirmed
  if (!user.confirmed) {
    const error = new Error("Your Account has not been confirmed");
    return res.status(403).json({ msg: error.message });
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
    const error = new Error("The password is incorrect");
    return res.status(403).json({ msg: error.message });
  }
};

const confirmUser = async (req, res) => {
  const { token } = req.params; //para obtener el token desde la ruta dinámica
  const userConfirm = await User.findOne({ token }); //Check if there is a user with that token
  if (!userConfirm) {
    const error = new Error("Invalid token");
    return res.status(403).json({ msg: error.message });
  }

  try {
    userConfirm.confirmed = true;
    userConfirm.token = ""; //Token de un sólo uso
    await userConfirm.save(); // Save changes bbdd.
    res.json({ msg: "User successfully confirmed" });
  } catch (error) {
    console.log(error);
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  //Check if the user exists
  const user = await User.findOne({
    email,
  });

  if (!user) {
    const error = new Error("The user doesn't exist");
    return res.status(404).json({ msg: error.message });
  }

  try {
    user.token = generateId();
    await user.save();

    //Enviar el email
    emailResetPassword({
      email: user.email,
      name: user.name,
      token: user.token,
    });

    res.json({ msg: "We have sent an email with instructions" });
  } catch (error) {
    console.log(error);
  }
};

const validateToken = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ token });
  if (!user) {
    const error = new Error("Invalid token");
    return res.status(404).json({ msg: error.message });
  } else {
    res.json({ msg: "Valid token and user exists" });
  }
};

const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ token });
  if (!user) {
    const error = new Error("Invalid token");
    return res.status(404).json({ msg: error.message });
  } else {
    user.password = password;
    user.token = "";
    try {
      await user.save();
      res.json({ msg: "Password correctly modified" });
    } catch (error) {
      console.log(error);
    }
  }
};

const profile = async (req, res) => {
  const { user } = req;

  res.json(user);
};

export {
  createUser,
  authenticateUser,
  confirmUser,
  forgetPassword,
  validateToken,
  newPassword,
  profile,
};
