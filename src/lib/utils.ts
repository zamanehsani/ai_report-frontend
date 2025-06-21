import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import type { siteType } from "@/store/site-store";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CreateSiteProp {
  data: siteType;
  url: string;
  token: string;
}
export const CreateSite = async ({ data, url, token }: CreateSiteProp) => {
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

export const editSite = async ({ data, url, token }: CreateSiteProp) => {
  try {
    const response = await axios.put(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to create site";
  }
};

export const removeSite = async (token: string, url: string) => {
  try {
    const sites = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return sites;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to list sites.";
  }
};

export const listSites = async (url: string, params?: Record<string, any>) => {
  try {
    const sites = await axios.get(url, params ? { params } : undefined);
    return sites;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to list sites.";
  }
};
