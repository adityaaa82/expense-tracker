export const updateTxn = async (
  amount: number,
  description: string,
  date: string,
  type: string,
  category: string,
  id: string,
) => {
  if (!amount || amount < 0) {
    return false;
  }

  try {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const transaction = {
      amount: amount,
      description: description,
      type: type,
      category: category,
      date: date,
    };

    const req = await fetch(`${baseUrl}/txn/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    });

    const res = await req.json();

    if (!req.ok) {
      return false;
    }

    return res.message;
  } catch (err: any) {
    return err.message;
  }
};
