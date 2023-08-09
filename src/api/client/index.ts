import axios from 'axios';

import { beforeRequest, errorRequest, successResponse, errorResponse } from './interceptors';

import { API_BASE_URL } from '../config';

const validateStatus = function (status: number) {
  return status >= 200 && status < 400;
};

const createClient = function (baseURL = API_BASE_URL) {
  const config = {
    baseURL,
    validateStatus,
  };

  const client = axios.create({ ...config });

  client.interceptors.request.use(beforeRequest, errorRequest);

  client.interceptors.response.use(successResponse, errorResponse);

  return client;
};

export { createClient };

export default createClient();
