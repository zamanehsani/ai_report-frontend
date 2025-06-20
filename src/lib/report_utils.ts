import type { reportType } from "@/store/report-store";
import axios from "axios";

interface CreateReportProp {
  data: any;
  url: string;
  token: string;
}

export const CreateReport = async ({ data, url, token }: CreateReportProp) => {
  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to create site";
  }
};

export const editReport = async ({ data, url, token }: CreateReportProp) => {
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

export const removeReport = async (token: string, url: string) => {
  try {
    const sites = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return sites;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to list sites.";
  }
};

export const listReport = async (url: string) => {
  try {
    const sites = await axios.get(url);
    return sites;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to list sites.";
  }
};
