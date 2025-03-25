/**
 * @author h345983745
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import blakejs from "blakejs";
import OperationError from "../errors/OperationError.mjs";
import Utils from "../Utils.mjs";
import { toBase64 } from "../lib/Base64.mjs";

/**
 * BLAKE2s Operation
 */
class BLAKE2s extends Operation {

    /**
     * BLAKE2s constructor
     */
    constructor() {
        super();

        this.name = "BLAKE2s";
        this.module = "Hashing";
        this.description = `对输入执行 BLAKE2s 哈希运算。<br><br>BLAKE2s 是 BLAKE 密码哈希函数的一种变体，针对 8 到 32 位平台进行了优化，可以生成 1 到 32 字节之间的任意大小的摘要。<br><br>支持使用可选密钥。`;
        this.infoURL = "https://wikipedia.org/wiki/BLAKE_(hash_function)#BLAKE2";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                "name": "大小",
                "type": "option",
                "value": ["256", "160", "128"]
            }, {
                "name": "输出编码",
                "type": "option",
                "value": ["Hex", "Base64", "Raw"]
            },
            {
                "name": "密钥",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["UTF8", "Decimal", "Base64", "Hex", "Latin1"]
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string} The input having been hashed with BLAKE2s in the encoding format specified.
     */
    run(input, args) {
        const [outSize, outFormat] = args;
        let key = Utils.convertToByteArray(args[2].string || "", args[2].option);
        if (key.length === 0) {
            key = null;
        } else if (key.length > 32) {
            throw new OperationError(["密钥长度不能超过 32 字节", "当前长度为 " + key.length + " 字节。"].join("\n"));
        }

        input = new Uint8Array(input);
        switch (outFormat) {
            case "Hex":
                return blakejs.blake2sHex(input, key, outSize / 8);
            case "Base64":
                return toBase64(blakejs.blake2s(input, key, outSize / 8));
            case "Raw":
                return Utils.arrayBufferToStr(blakejs.blake2s(input, key, outSize / 8).buffer);
            default:
                return new OperationError("不支持的输出类型");
        }
    }

}

export default BLAKE2s;
