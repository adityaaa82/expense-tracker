import { Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import NewTxn from "./NewTxn";

function Header() {
  const [isNewOpen, setNewOpen] = useState(false);
  return (
    <div className="py-4 px-2">
      <div className="flex flex-row justify-between items-center">
        <Link to="/" className="font-semibold text-xl">
          Expense Tracker
        </Link>
        <button
          onClick={() => setNewOpen((prev) => !prev)}
          className="bg-green-700 text-white px-4 max-sm:p-2 cursor-pointer hover:bg-green-800 transition-all duration-300 py-2 rounded-xl flex items-center flex-row gap-2 font-medium"
        >
          <span className="flex">
            <Plus size={20} />
          </span>{" "}
          <span className="max-sm:hidden">New Transaction</span>
        </button>
      </div>
      {isNewOpen && <NewTxn setOpen={setNewOpen} />}
    </div>
  );
}

export default Header;
