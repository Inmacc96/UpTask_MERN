import mongoose from "mongoose";
import bcrypt from "bcrypt";

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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next(); // No hace nada y se va al siguiente middleware
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Definimos el modelo
const User = mongoose.model("User", userSchema);

export default User;
