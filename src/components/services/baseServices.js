import axios from 'axios';

import { getAccessToken } from './utils';
export const baseUrl = 'http://dev.ubereats.guzmanygomez.com:9002/api';

const baseService = axios.create({
    baseURL: baseUrl,
    headers: { 'Authorization': 'Bearer ' + getAccessToken() }
});

export default baseService;
