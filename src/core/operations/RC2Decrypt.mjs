/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import forge from "node-forge";

/**
 * RC2 Decrypt operation
 */
class RC2Decrypt extends Operation {

    /**
     * RC2Decrypt constructor
     */
    constructor() {
        super();

        this.name = "RC2 解密";
        this.module = "Ciphers";
        this.description = "RC2（也称为 ARC2）是由 Ron Rivest 于 1987 年设计的对称密钥分组密码。“RC”代表“Rivest 密码”。<br><br><b>密钥：</b> RC2 使用可变大小的密钥。<br><br><b>初始向量 (IV)：</b> 要在 CBC 模式下运行密码，初始向量应为 8 字节长。如果初始向量留空，密码将在 ECB 模式下运行。<br><br><b>填充：</b> 在 CBC 和 ECB 模式下，都将使用 PKCS#7 填充。";
        this.infoURL = "https://wikipedia.org/wiki/RC2";
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
            iv = Utils.convertToByteString(args[1].string, args[1].option),
            [,, inputType, outputType] = args,
            decipher = forge.rc2.createDecryptionCipher(key);

        input = Utils.convertToByteString(input, inputType);

        decipher.start(iv || null);
        decipher.update(forge.util.createBuffer(input));
        decipher.finish();

        return outputType === "Hex" ? decipher.output.toHex() : decipher.output.getBytes();
    }

}

export default RC2Decrypt;
