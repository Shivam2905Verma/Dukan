import express from "express";
const router = express.Router();

import {
  deleteTrans,
  detailTrans,
  lastBalance,
  saveData,
  saveName,
  search,
  searchedNames,
  todayTransaction,
  updateTrans,
} from "../Controllers/dataRoutes.controller.js";

router.post("/savedata", saveData);
router.get("/todays_transactions", todayTransaction);
router.get("/search", search);
router.get("/detailTrans", detailTrans);
router.post("/update", updateTrans);
router.post("/savename", saveName);
router.get("/searchedNames", searchedNames);
router.get("/lastbalance", lastBalance);

router.delete("/deleteTrans/:id", deleteTrans);

export default router;
