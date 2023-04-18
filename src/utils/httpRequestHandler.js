import axios, { AxiosError } from 'axios';
import APIConstants from '../utils/apiConatants';
import { HttpReqHandlerError } from '../utils/customError';

class HttpRequestHandler {

    constructor(baseURL) {
        this.axios = axios.create({
            baseURL: baseURL,
            headers: { 'Content-Type': 'application/json' }
        });

        this.axios.interceptors.request.use(function (config) {
            const token = localStorage.getItem('token');
            config.headers.Authorization =  token ? `Bearer ${token}` : '';
            config.headers['is-session-list-required'] = token ? false : true;
            
            const sessionId = localStorage.getItem('session-id');
            config.headers['session-id'] = sessionId ? sessionId : '';
            return config;
        });
    }

    setDefaultProps = () => {
        // Alter defaults after instance has been created
        //this.axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
        this.axios.defaults.headers.post['Content-Type'] = 'application/json';
    }

    postData = (url, data) => {
        return new Promise((resolve, reject) => {
            this.axios.post(url, data)
                .then((response) => {
                    this.processApiResponse(response, resolve);
                })
                .catch((error) => {
                    this.processApiResponse(error, reject);
                });
        });

    }

    getData = (url, data={}) => {
        let params =  new URLSearchParams({ params: JSON.stringify(data) });
        return new Promise((resolve, reject) => {
            this.axios.get(url, { params: params})
                .then((response) => {
                    this.processApiResponse(response, resolve);
                })
                .catch((error, param) => {
                    this.processApiResponse(error, reject);
                });
        });

    }

    deleteData = (url, data) => {
        return new Promise((resolve, reject) => {
            this.axios.delete(url, { data: data })
                .then((response) => {
                    this.processApiResponse(response, resolve);
                })
                .catch((error) => {
                    this.processApiResponse(error, reject);
                });
        });

    }

    patchData = (url, data) => {
        return new Promise((resolve, reject) => {
            this.axios.patch(url, data)
                .then((response) => {
                    this.processApiResponse(response, resolve);
                })
                .catch((error) => {
                    this.processApiResponse(error, reject);
                });
        });

    }

    downloadFile = (url, data) => {
        return new Promise((resolve, reject) => {
            this.axios.get(url, {
                params: { params: JSON.stringify(data) },
                responseType: 'arraybuffer'
            })
            .then((response) => {

                var blob = new window.Blob([response.data], { type: 'application/pdf' });
                var fileURL = URL.createObjectURL(blob);
                window.open(fileURL, "_blank");
            })
            .catch((error, param) => {
                this.processApiResponse(error, reject);
            });
        });

    }

    downloadZipFile = (url, data) => {
        return new Promise((resolve, reject) => {
            this.axios.get(url, {
                params: { params: JSON.stringify(data) },
                responseType: 'arraybuffer'
            })
            .then((response) => {
                let filename =  response.headers["content-disposition"].split('filename=')[1].replaceAll('"', '');
                
                var blob = new window.Blob([response.data], { type: 'application/zip' });
                var fileURL = URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = fileURL;
                a.download = filename;
                a.click();
            })
            .catch((error, param) => {
                this.processApiResponse(error, reject);
            });
        });

    }

    processApiResponse = (response, callback) => {
        let { status, data, message, code } = response;
        if (response instanceof HttpReqHandlerError) {
            console.error(response, response.props);
            callback(response.props);
        } else if (response instanceof AxiosError) {
            if(code === "ERR_NETWORK") {
                console.error(response, response.props);
                callback({ httpStatusCode: 401, message: message });
            } else if(code === "ERR_BAD_RESPONSE" && response.response && response.response.status == 500) {
                console.error(response, response.response.data);
                callback({ httpStatusCode: response.response.status, message: response.response.data.message });
            } else if (code === "ERR_BAD_REQUEST" && response.response && response.response.status == 401) {
                this.goToLoginPage();
                callback({ httpStatusCode: response.response.status, message: message });
            } else {
                console.error(response, response.props);
                callback({ httpStatusCode: response.response.status, message: message });
            }
        } else {
            if (status === 200) {
                if (data.statusCode === 100) {
                    console.log(response);
                    callback({ httpStatusCode: status, statusCode: data.statusCode, message: data.message, data: data.data });
                } else {
                    console.error("API response error with status code: " + data.statusCode + " & Message: " + data.message);
                    throw new HttpReqHandlerError("HttpReqHandlerError", { httpStatusCode: status, statusCode: data.statusCode, message: data.message });
                }
            } else {
                console.error(message);
                throw new HttpReqHandlerError("HttpReqHandlerError", { httpStatusCode: response.response.status, message: message });
            }
        }

    }

    goToLoginPage = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("session-id");
        localStorage.removeItem("session");
        window.location.assign(window.location.origin+"/login");        
    }

}

let inst = new HttpRequestHandler(APIConstants.HOST);


export default {
    postData: inst.postData,
    getData: inst.getData,
    deleteData: inst.deleteData,
    patchData: inst.patchData,
    downloadFile: inst.downloadFile,
    downloadZipFile: inst.downloadZipFile
}




        // let promise = AxiosApi.postData(APIConstants.USER_CREATE_OR_UPDATE, data);
        // promise.then((response) => {
        //     console.log(response.data);
        //     getListViewData();
        //     enqueueSnackbar('This is a success message!', { variant: "success" });
        // }, (error) => {
        //     console.log(error.message);
        //     enqueueSnackbar(error.message, { variant: "error" });
        // });