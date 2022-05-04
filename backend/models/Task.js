import mongoose from "mongoose";

const TaskSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    state: {
      type: Boolean,
      default: false,
    },
    deliveryDate: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    priority: {
      type: String,
      required: true,
      enum: ["Baja", "Media", "Alta"], // Permite únicamente los valores que está en este array
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", TaskSchema);

export default Task;
