/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import OperationError from "../errors/OperationError.mjs";
import forge from "node-forge";

/**
 * DES Decrypt operation
 */
class DESDecrypt extends Operation {

    /**
     * DESDecrypt constructor
     */
    constructor() {
        super();

        this.name = "DES 解密";
        this.module = "Ciphers";
        this.description = "DES 曾是主流的加密算法，并作为美国联邦信息处理标准 (FIPS) 发布。由于其密钥长度较短，现在被认为是不安全的。<br><br><b>密钥：</b> DES 使用 8 字节（64 位）的密钥长度。<br><br><b>初始向量 (IV)：</b> 初始向量应为 8 字节长。如果未输入，则默认为 8 个空字节。<br><br><b>填充：</b> 在 CBC 和 ECB 模式下，默认使用 PKCS#7 填充。";
        this.infoURL = "https://wikipedia.org/wiki/Data_Encryption_Standard";
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
                "name": "初始向量 (IV)",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                "name": "模式",
                "type": "option",
                "value": ["CBC", "CFB", "OFB", "CTR", "ECB", "CBC/NoPadding", "ECB/NoPadding"]
            },
            {
                "name": "输入",
                "type": "option",
                "value": ["Hex", "Raw"]
            },
            {
                "name": "输出",
                "type": "option",
                "value": ["Raw", "Hex"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const key = Utils.convertToByteString(args[0].string, args[0].option),
            iv = Utils.convertToByteArray(args[1].string, args[1].option),
            mode = args[2].substring(0, 3),
            noPadding = args[2].endsWith("NoPadding"),
            [,,, inputType, outputType] = args;

        if (key.length !== 8) {
            throw new OperationError(`无效的密钥长度：${key.length} 字节\n\nDES 使用 8 字节（64 位）的密钥长度。`);
        }
        if (iv.length !== 8 && mode !== "ECB") {
            throw new OperationError(`无效的初始向量 (IV) 长度：${iv.length} 字节\n\nDES 使用 8 字节（64 位）的初始向量 (IV) 长度。\n请确保您已正确指定类型（例如 Hex 与 UTF8）。`);
        }

        input = Utils.convertToByteString(input, inputType);

        const decipher = forge.cipher.createDecipher("DES-" + mode, key);

        /* Allow for a "no padding" mode */
        if (noPadding) {
            decipher.mode.unpad = function(output, options) {
                return true;
            };
        }

        decipher.start({iv: iv});
        decipher.update(forge.util.createBuffer(input));
        const result = decipher.finish();

        if (result) {
            return outputType === "Hex" ? decipher.output.toHex() : decipher.output.getBytes();
        } else {
            throw new OperationError("无法使用这些参数解密输入。");
        }
    }

}

export default DESDecrypt;
