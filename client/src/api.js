import axios from 'axios'

const serverURL = 'http://localhost:3001'; //121.40.100.199:12538/ | http://localhost:3001
const pythonURL = 'http://localhost:4000'; //121.40.100.199:12539/ | http://localhost:4000

export const fileURL = serverURL+'/getFile?filename='


axios.defaults.withCredentials = false; //連本地的時候
// axios.defaults.xsrfCookieName = 'csrftoken'
// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
// axios.defaults.withCredentials = true


export function server ({ url, method, headers, data, params }, option = {}) {
    return axios(serverURL+url, {
        method: method || 'GET', 
        data,
        params,
        headers: headers || {
            'content-type': 'application/json'
            // 'content-type': 'application/x-www-form-urlencoded'
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
            // 'content-type': 'application/x-www-form-urlencoded'
        },
        ...option
    })
}


