// api.js

import axios from 'axios';

// Change this to match your local server's address and port
const BASE_URL = 'http://192.168.64.38:8000/';

const api = axios.create({
    baseURL: BASE_URL,
});

export default api;
