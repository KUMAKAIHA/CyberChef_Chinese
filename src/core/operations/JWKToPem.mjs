/**
 * @author cplussharp
 * @copyright Crown Copyright 2021
 * @license Apache-2.0
 */

import r from "jsrsasign";
import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * PEM to JWK operation
 */
class PEMToJWK extends Operation {

    /**
     * PEMToJWK constructor
     */
    constructor() {
        super();

        this.name = "JWK 转换为 PEM";
        this.module = "PublicKey";
        this.description = "将 JSON Web Key 格式的密钥转换为 PEM 格式 (PKCS#8)。";
        this.infoURL = "https://datatracker.ietf.org/doc/html/rfc7517";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [];
        this.checks = [
            {
                "pattern": "\"kty\":\\s*\"(EC|RSA)\"",
                "flags": "gm",
                "args": []
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const inputJson = JSON.parse(input);

        let keys = [];
        if (Array.isArray(inputJson)) {
            // list of keys => transform all keys
            keys = inputJson;
        } else if (Array.isArray(inputJson.keys)) {
            // JSON Web Key Set => transform all keys
            keys = inputJson.keys;
        } else if (typeof inputJson === "object") {
            // single key
            keys.push(inputJson);
        } else {
            throw new OperationError("输入不是 JSON Web Key 格式");
        }

        let output = "";
        for (let i=0; i<keys.length; i++) {
            const jwk = keys[i];
            if (typeof jwk.kty !== "string") {
                throw new OperationError("无效的 JWK 格式");
            } else if ("|RSA|EC|".indexOf(jwk.kty) === -1) {
                throw new OperationError(`不支持的 JWK 密钥类型 '${inputJson.kty}'`);
            }

            const key = r.KEYUTIL.getKey(jwk);
            const pem = key.isPrivate ? r.KEYUTIL.getPEM(key, "PKCS8PRV") : r.KEYUTIL.getPEM(key);

            // PEM ends with '\n', so a new key always starts on a new line
            output += pem;
        }

        return output;
    }
}

export default PEMToJWK;
