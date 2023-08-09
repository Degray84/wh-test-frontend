/* eslint-disable no-param-reassign */
import type { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_TOKEN } from '../config';

type BeforeRequest = (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
type ErrorRequest = (error: AxiosError) => Promise<AxiosError>;
type SuccessResponse = (response: AxiosResponse) => AxiosResponse;
type ErrorResponse = (error: AxiosError) => Promise<AxiosError>;

const beforeRequest: BeforeRequest = function (config) {
  config.headers['X-RapidAPI-Key'] = API_TOKEN;
  config.headers['X-RapidAPI-Host'] = 'wft-geo-db.p.rapidapi.com';
  return config;
};

const errorRequest: ErrorRequest = function (error) {
  return Promise.reject(error);
};

const successResponse: SuccessResponse = function (response) {
  return response;
};

const errorResponse: ErrorResponse = function (error) {
  return Promise.reject(error);
};

export { beforeRequest, errorRequest, successResponse, errorResponse };
