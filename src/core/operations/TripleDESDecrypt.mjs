/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import OperationError from "../errors/OperationError.mjs";
import forge from "node-forge";

/**
 * Triple DES Decrypt operation
 */
class TripleDESDecrypt extends Operation {

    /**
     * TripleDESDecrypt constructor
     */
    constructor() {
        super();

        this.name = "Triple DES 解密";
        this.module = "Ciphers";
        this.description = "Triple DES 对每个数据块应用三次 DES 加密，以增加密钥长度。<br><br><b>密钥：</b> Triple DES 使用 24 字节（192 位）的密钥长度。<br><br><b>初始化向量：</b> 初始化向量应为 8 字节长。如果未输入，则默认为 8 个空字节。<br><br><b>填充：</b> 在 CBC 和 ECB 模式下，默认使用 PKCS#7 填充。";
        this.infoURL = "https://wikipedia.org/wiki/Triple_DES";
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
                "name": "初始化向量",
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
            inputType = args[3],
            outputType = args[4];

        if (key.length !== 24 && key.length !== 16) {
            throw new OperationError(`无效的密钥长度：${key.length} 字节\n\nTriple DES 使用 24 字节（192 位）的密钥长度。`);
        }
        if (iv.length !== 8 && mode !== "ECB") {
            throw new OperationError(`无效的初始化向量长度：${iv.length} 字节\n\nTriple DES 使用 8 字节（64 位）的初始化向量长度。\n请确保您已正确指定类型（例如 Hex 与 UTF8）。`);
        }

        input = Utils.convertToByteString(input, inputType);

        const decipher = forge.cipher.createDecipher("3DES-" + mode,
            key.length === 16 ? key + key.substring(0, 8) : key);

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

export default TripleDESDecrypt;
