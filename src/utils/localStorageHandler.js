import CryptoService from "./cryptoService";

const DEFAULT_APP_INFO = {
    "apartmentId": 0,
    "session": null,
    "sessionId": 0,
    "userRole": "",
    "permission": null,
    "token": ""
}

const INDEX_PREFIX = "_index__";
const SPLIT_INDEX = 7;
const SECRET_KEY_LENGTH = 32;
const INDEX_MIN_LENGTH = INDEX_PREFIX.length + 1 + CryptoService.BROWSER_ID_LENGTH;
const INDEX_MAX_LENGTH = INDEX_MIN_LENGTH + SECRET_KEY_LENGTH;



const StorageHandler = {
    createIndex: () => CryptoService.createIndex(INDEX_PREFIX),
    removeIndex: () => {
        let index = StorageHandler.getIndex();
        localStorage.removeItem(index);
    },
    getIndex: () => {
        let indexKey = Object.keys(localStorage).find( f => f.indexOf(INDEX_PREFIX) > -1);
        return indexKey;
    },
    updateIndexBySecretKey: (secretKey) => {
        let index;
        let oldIndex = StorageHandler.getIndex();
        let storageInfo = localStorage.getItem(oldIndex);

        if(oldIndex && INDEX_MAX_LENGTH == oldIndex.length) {
            localStorage.removeItem(oldIndex);
            oldIndex = oldIndex.substring(0, oldIndex.length - SPLIT_INDEX - SECRET_KEY_LENGTH) + oldIndex.substring(oldIndex.length - SPLIT_INDEX, oldIndex.length);
        }

        if(oldIndex && INDEX_MIN_LENGTH == oldIndex.length && secretKey && secretKey !== "") {
            index = oldIndex.substring(0, oldIndex.length - SPLIT_INDEX) + secretKey + oldIndex.substring(oldIndex.length - SPLIT_INDEX, oldIndex.length);
            localStorage.removeItem(oldIndex);
        }
        if(index) {
            localStorage.setItem(index, storageInfo);
        }
        return index;
    },
    getSecretKey: () => {
        let secretKey;
        let index = StorageHandler.getIndex();
        if(index && INDEX_MAX_LENGTH == index.length) {
            secretKey = index.substring(index.length - SPLIT_INDEX, index.length - SPLIT_INDEX - SECRET_KEY_LENGTH);

        } else if(index && INDEX_MIN_LENGTH == index.length) {
            secretKey = CryptoService.generateSecretKey();
            index = StorageHandler.updateIndexBySecretKey(secretKey);
        }
        return secretKey;
    },
    getStorageInfo: () => {
        let secretKey = StorageHandler.getSecretKey();
        let index = StorageHandler.getIndex();
        let strEncStorageInfo = localStorage.getItem(index);
        if(isValidParam(strEncStorageInfo) && strEncStorageInfo !== "") {
            let strStorageInfo = CryptoService.decrypt(strEncStorageInfo, secretKey);
            return strStorageInfo && strStorageInfo === "" ? undefined : JSON.parse(strStorageInfo);
        }
        return DEFAULT_APP_INFO;
    },
    setStorageInfo: (storageInfo) => {
        let index = StorageHandler.getIndex();
        if(index && storageInfo) {
            let secretKey = StorageHandler.getSecretKey();
            let strStorageInfo = CryptoService.encrypt(JSON.stringify({...DEFAULT_APP_INFO, ...storageInfo}), secretKey);
            localStorage.setItem(index, strStorageInfo);
        }
    },    
};

const LocalStorageHandler = {
    createIndex: () => {
        let index = StorageHandler.getIndex();
        if(!isValidParam(index)) {
            StorageHandler.createIndex();
        }
    },
    removeIndex: () => StorageHandler.removeIndex(),
    setToken: (token) => {        
        let storageInfo = StorageHandler.getStorageInfo();
        if(isValidParam(storageInfo)) {
            storageInfo.token = token;
            StorageHandler.setStorageInfo(storageInfo);
        }
    },
    getToken: () => {
        return StorageHandler.getStorageInfo().token;
    },
    setPermission: (permission) => {
        let storageInfo = StorageHandler.getStorageInfo();
        if(isValidParam(storageInfo)) {
            storageInfo.permission = permission;
            StorageHandler.setStorageInfo(storageInfo);
        }
    },
    getPermission: () => {
        return StorageHandler.getStorageInfo().permission;
    },
    setSessionId: (sessionId) => {
        let storageInfo = StorageHandler.getStorageInfo();
        if(isValidParam(storageInfo)) {
            storageInfo.sessionId = sessionId;
            StorageHandler.setStorageInfo(storageInfo);
        }
    },
    getSessionId: () => {
        return StorageHandler.getStorageInfo().sessionId;
    },
    setSession: (session) => {
        let storageInfo = StorageHandler.getStorageInfo();
        if(isValidParam(storageInfo)) {
            storageInfo.session = session;
            StorageHandler.setStorageInfo(storageInfo);
        }
    },
    getSession: () => {
        return StorageHandler.getStorageInfo().session;
    },
    setUserRole: (userRole) => {
        let storageInfo = StorageHandler.getStorageInfo();
        if(isValidParam(storageInfo)) {
            storageInfo.userRole = userRole;
            StorageHandler.setStorageInfo(storageInfo);
        }
    },
    getUserRole: () => {
        return StorageHandler.getStorageInfo().userRole;
    },
    setApartmentId: (apartmentId) => {
        let storageInfo = StorageHandler.getStorageInfo();
        if(isValidParam(storageInfo)) {
            storageInfo.apartmentId = apartmentId;
            StorageHandler.setStorageInfo(storageInfo);
        }
    },
    getApartmentId: () => {
        return StorageHandler.getStorageInfo().apartmentId;
    },
}

export default LocalStorageHandler;

const isValidParam = (arg) => {
    if(!arg || arg == null || arg == "null" || arg == undefined || arg === "undefined") {
        return false;
    }
    return true;
}