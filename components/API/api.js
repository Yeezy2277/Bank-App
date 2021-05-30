import axios from 'react-native-axios';
const config = {
    baseURL: "http://floating-citadel-46144.herokuapp.com/api/",
    headers: {
        "Content-Type": "application/json"
    }
};
const client = axios.create(config);
export const authMeAPI = {
    login(data) {
        return client.post(`token/`,data)
    },
    register(data) {
        return client.post(`register/`,data)
    },
}