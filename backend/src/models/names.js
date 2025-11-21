import mongoose from "mongoose";

const nameSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

const Name = mongoose.model("Name", nameSchema);

export default Name;
