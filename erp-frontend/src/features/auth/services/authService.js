import { login } from "../api/authApi";
import { setTokens } from "../authStorage";

export const loginUser = async (username, password) => {
  const res = await login({
    username,   // ✅ not email
    password,
  });

  const { access, refresh } = res.data;

  setTokens(access, refresh);

  return res.data;
};