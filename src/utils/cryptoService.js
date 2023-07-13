//Library used from cdn Link: https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
//reference https://www.tutorialspoint.com/What-is-JavaScript-AES-Encryption

import CryptoJS from "custom-crypto-js";

const BROWSER_ID_LENGTH = 64;


// Encryption function
const encrypt = (text, secretKey) => {
    let encrypted = CryptoJS.AES.encrypt(text, secretKey).toString()
    return encrypted;
}

// Decryption function
const decrypt = (encryptedText, secretKey) => {
    let decrypted = CryptoJS.AES.decrypt(encryptedText, secretKey).toString(CryptoJS.enc.Utf8);
    return decrypted;
}

const generateSecretKey = (length=32) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charsetLength = charset.length;
  
    let secretKey = '';
    const values = new Uint8Array(length);
    crypto.getRandomValues(values);
  
    for (let i = 0; i < length; i++) {
      secretKey += charset[values[i] % charsetLength];
    }
  
    return secretKey;
  }

  const generateBrowserId =  async () => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const plugins = Array.from(navigator.plugins).map((plugin) => plugin.name).join(',');
    const fingerprintString = userAgent + platform + plugins;
    
    const encoder = new TextEncoder();
    const data = encoder.encode(fingerprintString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const browserId = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
    
    return browserId;
}

const createIndex =  async (prefix, appInfo) => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const plugins = Array.from(navigator.plugins).map((plugin) => plugin.name).join(',');
    const fingerprintString = userAgent + platform + plugins;
    
    const encoder = new TextEncoder();
    const data = encoder.encode(fingerprintString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const browserId = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');

    let index = prefix+"_"+browserId;
    console.log("browserId: ", browserId);
    console.log("index: ", index);
    if(!Object.keys(localStorage).find( f => f.indexOf(index) == 0)) {
        localStorage.setItem(index, JSON.stringify(appInfo))
    }   
    
}


const CryptoService = {
    encrypt,
    decrypt,
    generateSecretKey,
    generateBrowserId,
    createIndex,
    BROWSER_ID_LENGTH
}
export default CryptoService;