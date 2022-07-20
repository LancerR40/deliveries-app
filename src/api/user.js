import axios from "axios"
import { USER_DATA_URL } from "./constants"
import * as SecureStore from "expo-secure-store";

export const getUserDataAPI = async () => {
  let token = await SecureStore.getItemAsync("token") || ""

  try {
    const request = await axios.get(USER_DATA_URL, { headers: { "x-authorization-token": token } })
    return request.data
  } catch (error) {
    return error
  }
}