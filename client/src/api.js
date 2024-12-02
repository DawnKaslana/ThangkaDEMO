import axios from 'axios'

const serverURL = 'http://localhost:3001'; //http://121.40.100.199:12538 | localhost:3001
const pythonURL = 'http://localhost:4000'; //http://121.40.100.199:12539 | localhost:4000

export const fileURL = new URL('/getFile?filename=', serverURL).href


axios.defaults.withCredentials = false; //連本地的時候
// axios.defaults.xsrfCookieName = 'csrftoken'
// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
// axios.defaults.withCredentials = true


export function server ({ url, method, headers, data, params }, option = {}) {
    return axios(new URL(url,serverURL).href, {
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
    return axios(new URL(url,pythonURL).href, {
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


