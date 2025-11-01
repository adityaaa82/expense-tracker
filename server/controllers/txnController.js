import { txnData } from "../models/transactionModel.js";

export const createTxn = async (req, res) => {
  const { type, amount, description, category, date } = req.body;

  if (!amount || !type || !category || !date) {
    return res.status(400).json({
      message: "Transaction details are required.",
    });
  }

  try {
    const transaction = {
      type: type,
      amount: amount,
      description: description.length > 0 ? description : "",
      category: category,
      date: date,
    };

    await txnData.insertMany(transaction);

    return res.status(200).json({
      message: "Transaction has been saved.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to save transaction, try again.",
      sysMessage: error.message,
    });
  }
};

export const updateTxn = async (req, res) => {
  const { type, amount, description, category, date } = req.body;
  const txnId = req.params.txnId;

  if (!amount || !type || !category || !date) {
    return res.status(400).json({
      message: "Transaction details are required.",
    });
  }

  if (!txnId) {
    return res.status(400).json({
      message: "Transaction Id is missing.",
    });
  }

  try {
    await txnData.findOneAndUpdate(
      { _id: txnId },
      {
        $set: {
          type: type,
          amount: amount,
          description: description,
          category: category,
          date: date,
          updatedAt: Date.now(),
        },
      }
    );

    return res.status(200).json({
      message: "Transaction has been updated.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update transaction.",
      sysMessage: error.message,
    });
  }
};

export const deleteTxn = async (req, res) => {
  const { txnId } = req.params;

  if (!txnId) {
    return res.status(400).json({
      message: "Transaction Id is missing.",
    });
  }

  try {
    await txnData.findByIdAndDelete(txnId);
    return res.status(200).json({
      message: "Transaction has been deleted.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete transaction.",
      sysMessage: error.message,
    });
  }
};

export const getTxn = async (req, res) => {
  try {
    const searchTxn = await txnData.find({}).lean().sort();
    if (searchTxn.length <= 0) {
      return res.status(400).json({
        message: "Didn't have transactions yet.",
      });
    }

    return res.status(200).json({
      message: "Transactions are found.",
      transactions: searchTxn,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to find transactions.",
      sysMessage: error.message,
    });
  }
};

export const getFiltered = async (req, res) => {
  const { type, category, startDate, endDate } = req.query;
  const filter = {};

  if (type !== "all") {
    filter.type = type;
  }

  if (category !== "all") {
    filter.category = category;
  }

  if (startDate || endDate) {
    filter.date = {
      ...(startDate && { $gte: new Date(startDate) }),
      ...(endDate && { $lte: new Date(endDate) }),
    };
  }

  try {
    const transactions = await txnData.find(filter).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error.",
      sysMessage: error.message,
    });
  }
};
