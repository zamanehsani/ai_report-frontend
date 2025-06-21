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

export async function listReport(url: string, params: any) {
  const searchParams = new URLSearchParams();
  if (params.sites && params.sites.length > 0) {
    params.sites.forEach((id: string) => searchParams.append("sites", id));
  }
  if (params.date)
    searchParams.append("date", params.date.toISOString ? params.date.toISOString() : params.date);
  if (params.time) searchParams.append("time", params.time);
  if (params.user_email) searchParams.append("user_email", params.user_email);

  const response = await fetch(`${url}?${searchParams.toString()}`);
  return response.json();
}
