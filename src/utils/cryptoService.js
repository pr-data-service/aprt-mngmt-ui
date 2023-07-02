//Library used from cdn Link: https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
//reference https://www.tutorialspoint.com/What-is-JavaScript-AES-Encryption

import CryptoJS from "custom-crypto-js";
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

const CryptoService = {
    encrypt,
    decrypt,
}
export default CryptoService;