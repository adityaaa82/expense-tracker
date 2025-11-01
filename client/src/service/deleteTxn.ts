export const deleteTxn = async (id: string) => {
  if (!id) {
    return false;
  }

  try {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const req = await fetch(`${baseUrl}/txn/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
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
