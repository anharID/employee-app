import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.64.38:8000/';

const api = axios.create({
    baseURL: BASE_URL,
    responseType: 'json',

});

api.interceptors.request.use(async config => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
