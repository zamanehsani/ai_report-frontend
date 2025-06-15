import type { userType } from "@/store/use-store";
import axios from "axios";

interface CreateUserProp {
  data: userType;
  url: string;
  token: string;
}

export const RegisterUser = async ({ data, url, token }: CreateUserProp) => {
  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to create site";
  }
};

export const UploadProfile = async ({ formData, url, token }: any) => {
  try {
    const response = await axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response || "Fialed to upload";
  }
};

export const editUser = async ({ data, url, token }: CreateUserProp) => {
  try {
    const response = await axios.put(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to create site";
  }
};

export const removeUser = async (token: string, url: string) => {
  try {
    const users = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return users;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to list sites.";
  }
};

export const listUser = async (url: string) => {
  try {
    const users = await axios.get(url);
    return users;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to list sites.";
  }
};
