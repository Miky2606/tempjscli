import axios, { AxiosError } from "axios";
import { ITemplate, IUser, ResponseServer } from "interface/interface_api";
import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "/.env" });
const API_URL = process.env.API_URL || "https://lazytemp.com/api/";

const responseError = <T>(error: AxiosError): ResponseServer<T> => {
  if (error.response?.status === 400)
    return {
      error: error.response.data as string,
    };

  return {
    error: error.message,
  };
};

export const find_user = async (id: string): Promise<ResponseServer<IUser>> => {
  try {
    const find = await axios.get<{ data: IUser[] }>(
      `${API_URL}/get-code-auth`,
      {
        headers: {
          code: id,
        },
      }
    );

    return {
      data: find.data.data[0],
    };
  } catch (error) {
    if (error instanceof axios.AxiosError) {
      if (error.response?.status === 400) return responseError(error);
    }

    return {
      error: error as string,
    };
  }
};

export const find_template = async (
  id: string
): Promise<ResponseServer<ITemplate>> => {
  try {
    const find = await axios.get<{ data: ITemplate[] }>(`${API_URL}/${id}`, {
      headers: {
        code: id,
      },
    });

    return {
      data: find.data.data[0],
    };
  } catch (error) {
    if (error instanceof axios.AxiosError) {
      return await responseError<ITemplate>(error);
    }
    return {
      error: error as string,
    };
  }
};

export const upload_template = async (
  code_auth: string,
  name: string,
  description: string
): Promise<ResponseServer<{ user: IUser; id: string }>> => {
  try {
    const find = await axios.post<{ data: { user: IUser; id: string } }>(
      `${API_URL}/templates`,
      {
        code_auth: code_auth,
        name: name,
        description: description,
      }
    );

    return {
      data: find.data.data,
    };
  } catch (error) {
    if (error instanceof axios.AxiosError) {
      if (error.response?.status === 400) return responseError(error);
    }

    return {
      error: error as string,
    };
  }
};

export const update_downloads = async (
  id: string
): Promise<ResponseServer<string>> => {
  try {
    const find = await axios.put<{ data: string }>(`${API_URL}/templates`, {
      id: id,
    });

    return {
      data: find.data.data,
    };
  } catch (error) {
    if (error instanceof axios.AxiosError) {
      return responseError<string>(error);
    }
    return {
      error: error as string,
    };
  }
};

export const delete_template = async (
  id: string
): Promise<ResponseServer<string>> => {
  try {
    const find = await axios.delete<{ data: string }>(`${API_URL}/templates`, {
      data: {
        id: id,
      },
    });

    return {
      data: find.data.data,
    };
  } catch (error) {
    if (error instanceof axios.AxiosError) {
      return responseError<string>(error);
    }
    return {
      error: error as string,
    };
  }
};
