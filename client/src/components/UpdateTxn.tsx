import React, { useEffect, useState } from "react";
import type { transactionType } from "../types/transaction";
import { Info } from "lucide-react";
import BtnLoader from "./BtnLoader";
import { useDispatch, useSelector } from "react-redux";
import { updateTransaction } from "../service/transactionSlice";
import type { RootState } from "../store/store";
import { updateTxn } from "../service/updateTxn";

interface editTxn {
  setOpen: (value: boolean) => void;
  Id: string;
}

function UpdateTxn({ setOpen, Id }: editTxn) {
  const [txnData, setTxnData] = useState<transactionType>({
    _id: "",
    amount: 0,
    description: "",
    type: "income",
    category: "salary",
    date: new Date().toISOString().split("T")[0],
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [showMsg, setMsg] = useState<string>("");

  const dispatch = useDispatch();
  const transaction = useSelector((state: RootState) =>
    state.transactions.list.find((t) => t._id == Id)
  );

  useEffect(() => {
    if (transaction) {
      setTxnData(transaction);
      return;
    } else {
        setMsg("Transaction not found.");
        return;
    }

  }, [transaction]);

  const inputHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setTxnData((prev) => ({
      ...prev,
      [name]: name === "amount" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const editTransaction = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!txnData.amount || txnData.amount <= 0) {
      setMsg("Amount must be greater than 0 or positive.");
      setLoading(false);
      return;
    }

    const result = await updateTxn(
      txnData.amount,
      txnData.description,
      txnData.date,
      txnData.type,
      txnData.category,
      Id
    );

    if (!result) {
      setMsg(result);
      setLoading(false);
      return;
    } else {
      setMsg(result);
      setLoading(false);
      dispatch(updateTransaction(txnData));
      setOpen(false);
      return;
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-fit flex flex-col gap-4 bg-white p-6 rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div id="head">
          <h1 className="font-semibold text-lg">Edit transaction</h1>
          <h2>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</h2>
        </div>
        {showMsg.length > 0 && (
          <div className="flex flex-row gap-2 items-center p-2 bg-stone-900 rounded-xl text-white text-nowrap">
            <Info size={20} />
            <p>{showMsg}</p>
          </div>
        )}
        <form
          id="inputs"
          className="flex flex-col gap-2"
          onSubmit={editTransaction}
        >
          <span className="flex flex-col gap-1">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              name="amount"
              id="amount"
              value={txnData.amount}
              onChange={inputHandler}
              placeholder="Example: $4000"
              required
              className="w-full p-2 border border-stone-300 outline-none rounded-xl"
            />
          </span>
          <span className="flex flex-col gap-1">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              name="description"
              id="description"
              value={txnData.description}
              onChange={inputHandler}
              required
              placeholder="Example: Paid a bill."
              className="w-full p-2 border border-stone-300 outline-none rounded-xl"
            />
          </span>
          <span className="flex flex-col gap-1">
            <label htmlFor="type">Transaction type</label>
            <select
              name="type"
              id="type"
              value={txnData.type}
              onChange={inputHandler}
              className="w-full border border-stone-300 appearance-none rounded-xl p-2 outline-none"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </span>
          <span className="flex flex-col gap-1">
            <label htmlFor="type">Transaction Category</label>
            <select
              name="category"
              id="category"
              value={txnData.category}
              onChange={inputHandler}
              className="w-full border border-stone-300 appearance-none rounded-xl p-2 outline-none"
            >
              <option value="salary">Salary</option>
              <option value="freelance">Freelance</option>
              <option value="groceries">Groceries</option>
              <option value="entertainment">Entertainment</option>
              <option value="bills">Bills</option>
              <option value="other">Other</option>
            </select>
          </span>
          <span className="flex flex-col gap-1">
            <label htmlFor="date">Select a date</label>
            <input
              type="date"
              name="date"
              id="date"
              value={txnData.date}
              onChange={inputHandler}
              className="w-full border border-stone-300 p-2 rounded-xl outline-none"
              required
            />
          </span>
          <div className="flex flex-row gap-2 w-full">
            <button
              onClick={() => setOpen(false)}
              className="w-full bg-white text-black border border-stone-300 p-2 rounded-xl cursor-pointer"
              type="button"
            >
              Cancel
            </button>
            {loading ? (
              <button
                className="w-full bg-black opacity-80 text-white p-2 rounded-xl cursor-not-allowed"
                disabled
              >
                <span className="flex flex-row items-center gap-2 justify-center">
                  <BtnLoader />
                  <p>Updating..</p>
                </span>
              </button>
            ) : (
              <button
                className="w-full bg-black text-white p-2 rounded-xl cursor-pointer"
                type="submit"
              >
                Update
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateTxn;
