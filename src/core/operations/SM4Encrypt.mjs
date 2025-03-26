/**
 * @author swesven
 * @copyright 2021
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import OperationError from "../errors/OperationError.mjs";
import { toHex } from "../lib/Hex.mjs";
import { encryptSM4 } from "../lib/SM4.mjs";

/**
 * SM4 Encrypt operation
 */
class SM4Encrypt extends Operation {

    /**
     * SM4Encrypt constructor
     */
    constructor() {
        super();

        this.name = "SM4 加密";
        this.module = "Ciphers";
        this.description = "SM4 是一种 128 位分组密码，目前已成为中国国家标准 (GB/T 32907-2016)。支持多种分组密码模式。当使用 CBC 或 ECB 模式时，将使用 PKCS#7 填充方案。";
        this.infoURL = "https://wikipedia.org/wiki/SM4_(cipher)";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "密钥",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                "name": "初始向量",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                "name": "模式",
                "type": "option",
                "value": ["CBC", "CFB", "OFB", "CTR", "ECB"]
            },
            {
                "name": "输入",
                "type": "option",
                "value": ["Raw", "Hex"]
            },
            {
                "name": "输出",
                "type": "option",
                "value": ["Hex", "Raw"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const key = Utils.convertToByteArray(args[0].string, args[0].option),
            iv = Utils.convertToByteArray(args[1].string, args[1].option),
            [,, mode, inputType, outputType] = args;

        if (key.length !== 16)
            throw new OperationError(`密钥长度无效: ${key.length} 字节

SM4 使用 16 字节（128 位）的密钥长度。`);
        if (iv.length !== 16 && !mode.startsWith("ECB"))
            throw new OperationError(`IV 长度无效: ${iv.length} 字节

SM4 使用 16 字节（128 位）的 IV 长度。
请确保您已正确指定类型（例如 Hex 与 UTF8）。`);

        input = Utils.convertToByteArray(input, inputType);
        const output = encryptSM4(input, key, iv, mode.substring(0, 3), mode.endsWith("NoPadding"));
        return outputType === "Hex" ? toHex(output) : Utils.byteArrayToUtf8(output);
    }

}

export default SM4Encrypt;
