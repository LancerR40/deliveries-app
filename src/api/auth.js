import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { CHECK_SESSION_URL, LOGIN_URL } from "./constants";

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU3MDczNTE1LCJleHAiOjE2NTcxNTk5MTV9.iAA5D_-SQoFFXI6TWwb384s7FRPr-nrvS2McfCsDsw4
// Probar luego para manejar token cauducados

export const checkSessionAPI = async () => {
  let token = await SecureStore.getItemAsync("token");

  try {
    const request = await axios.get(CHECK_SESSION_URL, {
      headers: {
        "x-authorization-token": token || "",
      },
    });

    return request.data;
  } catch (error) {
    return error
  }
};

export const loginAPI = async (data) => {
  try {
    const request = await axios.post(LOGIN_URL, data);

    return request.data;
  } catch (error) {
    return error
  }
};