/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import forge from "node-forge";
import OperationError from "../errors/OperationError.mjs";
import { Blowfish } from "../lib/Blowfish.mjs";

/**
 * Blowfish Encrypt operation
 */
class BlowfishEncrypt extends Operation {

    /**
     * BlowfishEncrypt constructor
     */
    constructor() {
        super();

        this.name = "Blowfish 加密";
        this.module = "Ciphers";
        this.description = "Blowfish 是一种对称密钥分组密码，由 Bruce Schneier 于 1993 年设计，并包含在大量的密码套件和加密产品中。目前 AES 受到更多关注。<br><br><b>IV（初始化向量）:</b> 初始化向量应为 8 字节长。如果未输入，则默认为 8 个空字节。";
        this.infoURL = "https://wikipedia.org/wiki/Blowfish_(cipher)";
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
                "name": "初始化向量 (IV)",
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
        const key = Utils.convertToByteString(args[0].string, args[0].option),
            iv = Utils.convertToByteString(args[1].string, args[1].option),
            mode = args[2],
            inputType = args[3],
            outputType = args[4];

        if (key.length < 4 || key.length > 56) {
            throw new OperationError(`无效的密钥长度：${key.length} 字节\n\nBlowfish 密钥长度必须在 4 到 56 字节（32-448 位）之间。`);
        }

        if (mode !== "ECB" && iv.length !== 8) {
            throw new OperationError(`无效的初始化向量长度：${iv.length} 字节。应为 8 字节。`);
        }

        input = Utils.convertToByteString(input, inputType);

        const cipher = Blowfish.createCipher(key, mode);
        cipher.start({iv: iv});
        cipher.update(forge.util.createBuffer(input));
        cipher.finish();

        if (outputType === "Hex") {
            return cipher.output.toHex();
        } else {
            return cipher.output.getBytes();
        }
    }

}

export default BlowfishEncrypt;
