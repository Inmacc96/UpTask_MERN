import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Elimina los espacios del principio y final
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Asegura que es un usuario por cuenta. No puede haber
      // dos perfiles con el mismo email
    },
    token: {
      type: String,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamp: true, //Crea dos columnas más, una de creado y otra de actualizado
  }
);

//Definimos el modelo
const User = mongoose.model("User", userSchema);

export default User;
