import axios from "axios";

interface CreateClientProp {
  data: {
    id?: string;
    email: string;
    officialName: string;
    contactPerson: {
      name: string;
    };
    location?: string;
    phone: string;
    address: string;
    password: string;
    site?: string[];
  };
  url: string;
  token: string;
}

export const CreateClient = async ({ data, url, token }: CreateClientProp) => {
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

export const editClient = async ({ data, url, token }: CreateClientProp) => {
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

export const removeClient = async (token: string, url: string) => {
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

export const listClient = async (url: string) => {
  try {
    const sites = await axios.get(url);
    return sites;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to list sites.";
  }
};
