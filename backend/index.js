import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
app.use(express.json());

dotenv.config();

connectDB();

// Configurar CORS
const whiteList = [process.env.FRONTEND_URL]; //Dominios que están permitidos
//Le estamos diciendo que este localhost:4000 acepta peticiones del localhost:3000

const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.includes(origin)) {
      //Puede consultar la API
      callback(null, true);
    } else {
      // No está permitido el request
      callback(new Error("Error CORS"));
    }
  },
};

app.use(cors(corsOptions));

// Routing
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Stocket.io
import { Server } from "socket.io";

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

io.on("connection", (socket) => {
  console.log("Conectado a socket.io");

  // Definir los evenetos de socket.io
  // on es para definir lo que va hacer cuando el evento ocurra
  socket.on("test", (data) => {
    console.log("test desde Socket.io", data);

    //Enviar una respuesta de regreso
    // emit envia un evento
    socket.emit("response", { name: "Inma" });
  });
});
