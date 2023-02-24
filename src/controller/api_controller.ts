import axios, { AxiosError } from "axios";
import { ITemplate, IUser, ResponseServer } from "interface/interface_api";

const API_URL = "http://localhost:3000/api/";

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
      return responseError<ITemplate>(error);
    }
    return {
      error: error as string,
    };
  }
};

export const upload_template = async (
  code_auth: string,
  name: string
): Promise<ResponseServer<IUser>> => {
  try {
    const find = await axios.post<{ data: IUser }>(`${API_URL}/templates`, {
      code_auth: code_auth,
      name: name,
    });

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
