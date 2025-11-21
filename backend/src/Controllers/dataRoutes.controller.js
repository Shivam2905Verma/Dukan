import ChainDetail from "../models/chain.js";
import Name from "../models/names.js";

const saveData = async (req, res) => {
  try {
    const {
      name,
      weightAndTunch,
      date,
      time,
      lastBalance,
      chainTotal,
      grossTotal,
      goldPaid,
      remainingGold,
      todayRate,
      goldToCash,
      totalCash,
      cashPaid,
      remainingCash,
    } = req.body;

    const newChaindata = {
      name,
      weightAndTunch,
      date,
      time,
      lastBalance,
      chainTotal,
      grossTotal,
      goldPaid,
      remainingGold,
      todayRate,
      goldToCash,
      totalCash,
      cashPaid,
      remainingCash,
    };
    const newChain = new ChainDetail(newChaindata);
    await newChain.save();
    res.status(200).json({ success: true, message: "Chains sold!" });
  } catch (error) {
    res.status(500).json({ message: "Not Able to save the Data" });
  }
};

const todayTransaction = async (req, res) => {
  try {
    const { dateInput } = req.query;
    if (!dateInput)
      return res.status(400).send({ message: "Date is required" });

    const start = new Date(dateInput);
    start.setHours(0, 0, 0, 0);

    const end = new Date(dateInput);
    end.setHours(23, 59, 59, 999);

    const data = await ChainDetail.find({
      date: { $gte: start, $lte: end },
    });

    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

const search = async (req, res) => {
  const { search } = req.query;

  if (!search || search.trim() === "") {
    return res.send([]);
  }

  try {
    const data = await ChainDetail.find({
      name: { $regex: new RegExp(`^${search}`, "i") },
    });

    res.send(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const detailTrans = async (req, res) => {
  const { id } = req.query;

  const data = await ChainDetail.findById(id);

  res.send(data);
};

const updateTrans = async (req, res) => {
  const {
    id,
    weightAndTunch,
    lastBalance,
    chainTotal,
    grossTotal,
    goldPaid,
    remainingGold,
    todayRate,
    goldToCash,
    totalCash,
    cashPaid,
    remainingCash,
  } = req.body;

  try {
    const data = await ChainDetail.findByIdAndUpdate(
      id, // now this is defined
      {
        weightAndTunch,
        lastBalance,
        chainTotal,
        grossTotal,
        goldPaid,
        remainingGold,
        todayRate,
        goldToCash,
        totalCash,
        cashPaid,
        remainingCash,
      },
      { new: true } // return the updated document
    );

    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const saveName = async (req, res) => {
  try {
    const findName = await Name.findOne({ name: req.body.name });
    if (!findName) {
      const newName = new Name({ name: req.body.name });
      await newName.save();
      res.status(201).send("Name added");
    } else {
      res.send("Name already exist");
      return;
    }
  } catch (error) {
    res.send(error.message);
  }
};

const searchedNames = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search || search.trim() === "") {
      return res.send([]); // return empty array if no search term
    }

    const findName = await Name.find({
      name: { $regex: new RegExp(`^${search}`, "i") },
    });

    res.send(findName);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const lastBalance = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const findLastBalance = await ChainDetail.find({
      name: { $regex: new RegExp(`^${search}$`, "i") },
    })
      .sort({ date: -1 })
      .limit(1);

    if (findLastBalance.length === 0) {
      return res.json({ message: "No records found" });
    }

    res.json(findLastBalance[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteTrans = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ChainDetail.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).send("No record found to delete");
    }

    res.send("Record deleted successfully");
  } catch (error) {
    res.send("Error deleting record: " + error.message);
  }
};

export {
  saveData,
  todayTransaction,
  search,
  detailTrans,
  updateTrans,
  saveName,
  searchedNames,
  lastBalance,
  deleteTrans,
};
