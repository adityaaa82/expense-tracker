import {
  ArrowDownLeft,
  ArrowDownRight,
  CircleDollarSign,
  Clapperboard,
  HandCoins,
  Info,
  ReceiptText,
  Salad,
  SquarePen,
  Trash,
} from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../store/store";
import { getTxns } from "../service/getTxns";
import { removeTransaction, setTransaction } from "../service/transactionSlice";
import EditTxn from "../components/UpdateTxn";
import { deleteTxn } from "../service/deleteTxn";
import PageLoader from "../components/PageLoader";
import type { transactionFilterType } from "../types/transaction";
import BtnLoader from "../components/BtnLoader";
import { filterTxn } from "../service/filterTxn";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

function Dashboard() {
  const [isEditOpen, setEditOpen] = useState<boolean>(false);
  const [currId, setCurrId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const [showMsg, setMsg] = useState<string>("");
  const [filterPie, setFilterPie] = useState<Record<string, number>>({});
  const [graphLoading, setgraphLoading] = useState<boolean>(false);
  const [filterLoading, setFilterLoading] = useState<boolean>(false);
  const [graphData, setGraphData] = useState<any>({
    labels: [],
    income: [],
    expense: [],
  });

  const [filter, setFilter] = useState<transactionFilterType>({
    type: "all",
    category: "all",
    startDate: "",
    endDate: "",
  });

  const applyFilter = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFilterLoading(true);
    const result = await filterTxn(filter);

    if (!result) {
      setMsg(result);
      setFilterLoading(false);
      return;
    } else if (result == "Failed to fetch") {
      setMsg("Check your network connection.");
      setFilterLoading(false);
      dispatch(setTransaction([]));
      return;
    } else {
      dispatch(setTransaction(result));
      setFilterLoading(false);
      setMsg("");
      return;
    }
  };

  const inputHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const transactions = useSelector(
    (state: RootState) => state.transactions.list
  );

  useEffect(() => {
    setLoading(true);
    const loadTransactions = async () => {
      const result = await getTxns();

      if (!result) {
        setMsg("Failed to get transactions.");
        setLoading(false);
        return;
      } else if (result === "Failed to fetch") {
        setMsg("Check your network connection.");
        dispatch(setTransaction([]));
        setLoading(false);
        return;
      } else {
        dispatch(setTransaction(result));
        setLoading(false);
        return;
      }
    };

    loadTransactions();
  }, [dispatch]);

  useEffect(() => {
    setgraphLoading(true);
    if (transactions.length > 0) {
      const filterPie: Record<string, number> = {};
      transactions.forEach((tr) => {
        filterPie[tr.category] = (filterPie[tr.category] || 0) + tr.amount;
      });
      setFilterPie(filterPie);
    }

    if (transactions.length > 0) {
      const grouped: any = {};
      transactions.forEach((t) => {
        const date = t.date;
        if (!grouped[date]) {
          grouped[date] = { income: 0, expense: 0 };
        }
        grouped[date][t.type] += t.amount;

        const labels = Object.keys(grouped).sort();
        const income = labels.map((d) => grouped[d].income);
        const expense = labels.map((d) => grouped[d].expense);
        setGraphData({ labels, income, expense });
      });
    }
    setgraphLoading(false);
  }, [transactions]);

  const deleteTransaction = async (id: string) => {
    if (!id) {
      setMsg("Transaction Id is required.");
      return;
    }

    const confirmation = confirm("Are u sure ?");
    if (!confirmation) {
      return;
    }

    const result = await deleteTxn(id);

    if (!result) {
      setMsg(result);
      return;
    } else {
      setMsg(result);
      dispatch(removeTransaction(id));
      return;
    }
  };

  const pieData = {
    labels: Object.keys(filterPie),
    datasets: [
      {
        data: Object.values(filterPie),
        backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"],
        borderWidth: 1,
      },
    ],
  };

  const chartData = {
    labels: graphData.labels,
    datasets: [
      {
        label: "Income",
        data: graphData.income,
        backgroundColor: "green",
      },
      {
        label: "Expense",
        data: graphData.expense,
        backgroundColor: "red",
      },
    ],
  };

  const clearFilter = () => {
    setFilter({
      type: "all",
      category: "all",
      startDate: "",
      endDate: "",
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "salary":
        return <CircleDollarSign size={20} />;
      case "groceries":
        return <Salad size={20} />;
      case "entertainment":
        return <Clapperboard size={20} />;
      case "bills":
        return <ReceiptText size={20} />;
      default:
        return <HandCoins size={20} />;
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      {showMsg.length != 0 && (
        <div className="bg-stone-900 w-full rounded-xl text-white p-2 text-center flex flex-row gap-2 items-center justify-center">
          <Info size={20} />
          {showMsg}
        </div>
      )}
      <div className="flex flex-row gap-2 p-2 max-[800px]:flex-col">
        <form
          id="filter"
          onSubmit={applyFilter}
          className="max-w-[400px] max-[800px]:max-w-full h-fit flex flex-wrap items-end gap-2 bg-white p-4 rounded-xl border border-stone-300"
        >
          <div className="flex flex-col w-full items-start gap-1">
            <label className="font-medium">Type</label>
            <select
              className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-stone-300 appearance-none"
              value={filter.type}
              onChange={inputHandler}
              name="type"
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="flex flex-col w-full items-start gap-1">
            <label className=" font-medium">Category</label>
            <select
              className="border border-gray-300 rounded-xl px-4 py-2 appearance-none focus:outline-none focus:ring-1 focus:ring-stone-300 w-full"
              value={filter.category}
              name="category"
              onChange={inputHandler}
            >
              <option value="all">All</option>
              <option value="salary">Salary</option>
              <option value="groceries">Groceries</option>
              <option value="entertainment">Entertainment</option>
              <option value="bills">Bills</option>
              <option value="freelance">Freelance</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex flex-col w-full items-start gap-1">
            <label htmlFor="startdate" className="font-medium">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              id="startdate"
              value={filter.startDate}
              onChange={inputHandler}
              className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-stone-300 w-full"
            />
          </div>

          <div className="flex flex-col w-full items-start gap-1">
            <label className="font-medium" htmlFor="enddate">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              id="enddate"
              value={filter.endDate}
              onChange={inputHandler}
              className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-stone-300 w-full"
            />
          </div>

          <div className="flex flex-row gap-2 w-full">
            <button
              onClick={clearFilter}
              type="button"
              className="border border-stone-300 px-6 py-2 rounded-xl hover:opacity-85 transition-all duration-150 cursor-pointer w-full"
            >
              Clear
            </button>
            {filterLoading ? (
              <button
                disabled
                className="bg-black text-white w-full px-6 py-2 rounded-xl opacity-85 cursor-not-allowed text-nowrap"
              >
                <span className="flex flex-row gap-2 items-center justify-center">
                  <BtnLoader />
                  Applying..
                </span>
              </button>
            ) : (
              <button
                type="submit"
                className="bg-black text-white w-full px-6 py-2 rounded-xl hover:opacity-85 cursor-pointer text-nowrap"
              >
                Save Changes
              </button>
            )}
          </div>
        </form>

        <div id="wrapper" className="flex flex-col gap-2 w-full">
          {graphLoading ? (
            <div>
              <PageLoader />
            </div>
          ) : (
            <div
              id="compare"
              className="w-full flex flex-row max-[800px]:flex-col items-start gap-2"
            >
              <div className="flex flex-col gap-2 max-w-full max-[800px]:w-full items-center text-center rounded-xl border border-stone-300 p-2">
                <h1 className="flex flex-row gap-2 items-center">
                  <span className="flex flex-row gap-1 items-center">
                    <span className="w-2 h-2 bg-red-500" />
                    Expense
                  </span>
                  <span className="flex flex-row gap-1 items-center">
                    <span className="w-2 h-2 bg-green-500" />
                    Income
                  </span>
                </h1>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Porro, amet.
                </p>
                <div className="w-48">
                  <Pie data={pieData} options={options} />
                </div>
              </div>
              <div className="w-full border border-stone-300 rounded-xl max-w-full p-2 h-full flex flex-col gap-2 items-center text-center">
                <h1 className="flex flex-row gap-2 items-center">
                  <span className="flex flex-row gap-1 items-center">
                    <span className="w-2 h-2 bg-green-500" />
                    Income
                  </span>
                  <span className="flex flex-row gap-1 items-center">
                    <span className="w-2 h-2 bg-red-500" />
                    Expense
                  </span>
                </h1>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Porro, amet.
                </p>
                <div className="max-w-full max-h-full">
                  <Bar data={chartData} options={options} />
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="mx-auto w-fit mt-10">
              <PageLoader />
            </div>
          ) : (
            <div
              id="list"
              className="flex flex-col gap-2 w-full"
            >
              {transactions.length != 0 ? (
                <div className="flex flex-col gap-2 w-full">
                  <h1 className="font-semibold">Your transactions :</h1>
                    <div className="overflow-x-auto w-full h-64 max-[800px]:w-[90vw]">
                      <table className="w-full border border-stone-300 rounded-xl">
                        <thead className="font-semibold">
                          <tr className="bg-stone-200">
                            <th className="p-2 text-center">Category</th>
                            <th className="p-2 text-center">Description</th>
                            <th className="p-2 text-center">Amount</th>
                            <th className="p-2 text-center">Type</th>
                            <th className="p-2 text-center">Date</th>
                            <th className="p-2 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.map((tr) => (
                            <tr
                              className="bg-stone-100 border border-transparent border-b-stone-200"
                              key={tr._id}
                            >
                              <td className="p-2 flex items-center gap-2 text-center">
                                {getCategoryIcon(tr.category)}
                                {tr.category}
                              </td>
                              <td className="p-2 truncate max-w-xs text-center">{tr.description}</td>
                              <td className="p-2 font-medium text-center">
                                ${tr.amount.toLocaleString()}
                              </td>
                              <td className="p-2 flex">
                                {tr.type === "income" ? (
                                  <span className="text-green-700 flex items-center gap-1 w-fit mx-auto">
                                    <ArrowDownLeft size={18} />
                                  </span>
                                ) : (
                                  <span className="text-red-700 flex items-center gap-1 w-fit mx-auto">
                                    <ArrowDownRight size={18} />
                                  </span>
                                )}
                              </td>
                              <td className="p-2 whitespace-nowrap text-center">
                                {tr.date}
                              </td>
                              <td className="p-2 text-center">
                                <div className="flex justify-center gap-2">
                                  <button
                                    className="bg-red-500 text-white p-2 rounded-xl hover:bg-red-600"
                                    onClick={() => deleteTransaction(tr._id)}
                                  >
                                    <Trash size={18} />
                                  </button>
                                  <button
                                    className="bg-green-700 text-white p-2 rounded-xl hover:bg-green-800"
                                    onClick={() => {
                                      setCurrId(tr._id);
                                      setEditOpen((prev) => !prev);
                                    }}
                                  >
                                    <SquarePen size={18} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                </div>
              ) : (
                <div>No transactions found!</div>
              )}
            </div>
          )}
        </div>
        {isEditOpen && <EditTxn Id={currId} setOpen={setEditOpen} />}
      </div>
    </div>
  );
}

export default Dashboard;
