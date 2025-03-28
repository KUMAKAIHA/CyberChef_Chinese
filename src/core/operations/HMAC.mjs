/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import CryptoApi from "crypto-api/src/crypto-api.mjs";

/**
 * HMAC operation
 */
class HMAC extends Operation {

    /**
     * HMAC constructor
     */
    constructor() {
        super();

        this.name = "HMAC";
        this.module = "Crypto";
        this.description = "密钥哈希消息认证码 (HMAC) 是一种使用密码学哈希函数进行消息认证的机制。";
        this.infoURL = "https://wikipedia.org/wiki/HMAC";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                "name": "密钥",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "Decimal", "Base64", "UTF8", "Latin1"]
            },
            {
                "name": "哈希函数",
                "type": "option",
                "value": [
                    "MD2",
                    "MD4",
                    "MD5",
                    "SHA0",
                    "SHA1",
                    "SHA224",
                    "SHA256",
                    "SHA384",
                    "SHA512",
                    "SHA512/224",
                    "SHA512/256",
                    "RIPEMD128",
                    "RIPEMD160",
                    "RIPEMD256",
                    "RIPEMD320",
                    "HAS160",
                    "Whirlpool",
                    "Whirlpool-0",
                    "Whirlpool-T",
                    "Snefru"
                ]
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const key = Utils.convertToByteString(args[0].string || "", args[0].option),
            hashFunc = args[1].toLowerCase(),
            msg = Utils.arrayBufferToStr(input, false),
            hasher = CryptoApi.getHasher(hashFunc);

        const mac = CryptoApi.getHmac(key, hasher);
        mac.update(msg);
        return CryptoApi.encoder.toHex(mac.finalize());
    }

}

export default HMAC;
