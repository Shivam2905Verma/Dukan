import mongoose from "mongoose";

const weightAndTunch = new mongoose.Schema({
  num1: { type: Number, required: true },
  num2: { type: Number, required: true },
  chainName: { type: String, required: true },
  chainWidth: { type: String, required: true },
});

const chainSchema = new mongoose.Schema({
  name: { type: String, required: true },
  weightAndTunch: { type: [weightAndTunch], required: true },
  date: { type: Date, default: () => new Date() },
  time: { type: String },
  lastBalance: { type: Number },
  chainTotal: { type: Number, required: true },
  grossTotal: { type: Number, required: true },
  goldPaid: { type: Number },
  remainingGold: { type: Number },
  todayRate: { type: Number },
  goldToCash: { type: Number },
  totalCash: { type: Number },
  cashPaid: { type: Number },
  remainingCash: { type: Number },
});

const ChainDetail = mongoose.model("ChainDetails", chainSchema);

export default ChainDetail;
