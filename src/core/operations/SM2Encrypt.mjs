/**
 * @author flakjacket95 [dflack95@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import OperationError from "../errors/OperationError.mjs";
import Operation from "../Operation.mjs";

import { SM2 } from "../lib/SM2.mjs";

/**
 * SM2 Encrypt operation
 */
class SM2Encrypt extends Operation {

    /**
     * SM2Encrypt constructor
     */
    constructor() {
        super();

        this.name = "SM2 加密";
        this.module = "Crypto";
        this.description = "使用 SM2 标准加密消息";
        this.infoURL = ""; // Usually a Wikipedia link. Remember to remove localisation (i.e. https://wikipedia.org/etc rather than https://en.wikipedia.org/etc)
        this.inputType = "ArrayBuffer";
        this.outputType = "string";

        this.args = [
            {
                name: "公钥 X",
                type: "string",
                value: "DEADBEEF"
            },
            {
                name: "公钥 Y",
                type: "string",
                value: "DEADBEEF"
            },
            {
                "name": "输出格式",
                "type": "option",
                "value": ["C1C3C2", "C1C2C3"],
                "defaultIndex": 0
            },
            {
                name: "曲线",
                type: "option",
                "value": ["sm2p256v1"],
                "defaultIndex": 0
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        const [publicKeyX, publicKeyY, outputFormat, curveName] = args;
        this.outputFormat = outputFormat;

        if (publicKeyX.length !== 64 || publicKeyY.length !== 64) {
            throw new OperationError("无效的公钥 - 请确保每个组成部分为 32 字节的十六进制值");
        }

        const sm2 = new SM2(curveName, outputFormat);
        sm2.setPublicKey(publicKeyX, publicKeyY);

        const result = sm2.encrypt(new Uint8Array(input));
        return result;
    }
}

export default SM2Encrypt;
