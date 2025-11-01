import type { transactionFilterType } from "../types/transaction";

export const filterTxn = async (filter: transactionFilterType) => {
  try {
    const query = new URLSearchParams({
      type: filter.type || "all",
      category: filter.category || "all",
      startDate: filter.startDate || "",
      endDate: filter.endDate || "",
    }).toString();

    const baseUrl = import.meta.env.VITE_BASE_URL;
    const req = await fetch(`${baseUrl}/txn?${query}`, {
      method: "GET",
    });

    if (!req.ok) {
      return false;
    }

    const res = await req.json();
    return res;
  } catch (err: any) {
    return err.message;
  }
};
