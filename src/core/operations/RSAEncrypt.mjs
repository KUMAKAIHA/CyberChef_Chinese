/**
 * @author Matt C [me@mitt.dev]
 * @copyright Crown Copyright 2020
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import forge from "node-forge";
import { MD_ALGORITHMS } from "../lib/RSA.mjs";

/**
 * RSA Encrypt operation
 */
class RSAEncrypt extends Operation {

    /**
     * RSAEncrypt constructor
     */
    constructor() {
        super();

        this.name = "RSA 加密";
        this.module = "Ciphers";
        this.description = "使用 PEM 编码的 RSA 公钥加密消息。";
        this.infoURL = "https://wikipedia.org/wiki/RSA_(cryptosystem)";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "RSA 公钥 (PEM)",
                type: "text",
                value: "-----BEGIN RSA PUBLIC KEY-----"
            },
            {
                name: "加密方案",
                type: "argSelector",
                value: [
                    {
                        name: "RSA-OAEP",
                        on: [2]
                    },
                    {
                        name: "RSAES-PKCS1-V1_5",
                        off: [2]
                    },
                    {
                        name: "RAW",
                        off: [2]
                    }]
            },
            {
                name: "消息摘要算法",
                type: "option",
                value: Object.keys(MD_ALGORITHMS)
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [pemKey, scheme, md] = args;

        if (pemKey.replace("-----BEGIN RSA PUBLIC KEY-----", "").length === 0) {
            throw new OperationError("请提供公钥。");
        }
        try {
            // Load public key
            const pubKey = forge.pki.publicKeyFromPem(pemKey);
            // https://github.com/digitalbazaar/forge/issues/465#issuecomment-271097600
            const plaintextBytes = forge.util.encodeUtf8(input);
            // Encrypt message
            const eMsg = pubKey.encrypt(plaintextBytes, scheme, {md: MD_ALGORITHMS[md].create()});
            return eMsg;
        } catch (err) {
            if (err.message === "RSAES-OAEP input message length is too long.") {
                throw new OperationError(`RSAES-OAEP input message length (${err.length}) is longer than the maximum allowed length (${err.maxLength}).`);
            }
            throw new OperationError(err);
        }
    }

}

export default RSAEncrypt;
