import axios from 'axios'

const serverURL = 'http://127.0.0.1:3001';
const pythonURL = 'http://localhost:4000';
export const fileURL = serverURL+'/getFile?filename='


axios.defaults.withCredentials = false;

export function server ({ url, method, headers, data, params }, option = {}) {
    return axios(serverURL+url, {
        method: method || 'GET', 
        data,
        params,
        headers: headers || {
            'content-type': 'application/json'
        },
        ...option
    })
}

export function django ({ url, method, headers, data, params }, option = {}) {
    return axios(pythonURL+url, {
        method: method || 'GET', 
        data,
        params,
        headers: headers || {
            'content-type': 'application/json'
        },
        ...option
    })
}


