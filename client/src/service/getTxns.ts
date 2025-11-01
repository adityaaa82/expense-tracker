export const getTxns = async () => {
  try {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const req = await fetch(`${baseUrl}/txn/get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!req.ok) {
      return false;
    }

    const res = await req.json();

    return res.transactions || [];

  } catch (err: any) {
    return err.message;
  }
};
