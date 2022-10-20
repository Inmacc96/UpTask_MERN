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
  console.log(`Server running on port ${PORT}`);
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
  console.log("Connected to socket.io");

  // Definir los evenetos de socket.io

  socket.on("open project", (project) => {
    socket.join(project);
    // A los usuarios que estén dentro de este proyecto, se les va a resfrecar la pantalla automaticamente
  });

  socket.on("new task", (task) => {
    const project = task.project;
    console.log(project);
    // Solo a los usuarios que estén en project se les va a emitir el evento added task
    socket.to(project).emit("added task", task);
  });

  socket.on("delete task", (task) => {
    const project = task.project;
    socket.to(project).emit("deleted task", task);
  });

  socket.on("edit task", (task) => {
    const project = task.project._id;
    socket.to(project).emit("updated task", task);
  });
});
