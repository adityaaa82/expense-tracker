import express from "express";
import { createTxn, deleteTxn, getFiltered, getTxn, updateTxn } from "../controllers/txnController.js";

const router = express.Router();

router.post("/create", createTxn);
router.get("/get", getTxn);
router.put("/update/:txnId", updateTxn);
router.delete("/delete/:txnId",  deleteTxn);
router.get("/", getFiltered);

export default router;