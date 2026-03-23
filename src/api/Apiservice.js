import axiosInstance from "./Axiosinstance";

const apiService = async (httpMethod, url, reqBody) => {
  const reqConfig = {
    method: httpMethod,
    url,
    data: reqBody,
  };

  try {
    const response = await axiosInstance(reqConfig);
    return response;
  } catch (err) {
    throw err;
  }
};

export default apiService;