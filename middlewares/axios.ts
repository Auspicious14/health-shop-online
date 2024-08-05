import axios from "axios";

export const apiReq = async () => {
  const config = {
    baseURL: "https://api.paystack.co",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
  };

  const api = axios.create(config);
  return {
    api,
  };
};
