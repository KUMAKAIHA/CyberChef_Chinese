/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import {toJA4} from "../lib/JA4.mjs";

/**
 * JA4 Fingerprint operation
 */
class JA4Fingerprint extends Operation {

    /**
     * JA4Fingerprint constructor
     */
    constructor() {
        super();

        this.name = "JA4 指纹";
        this.module = "Crypto";
        this.description = "生成 JA4 指纹，通过哈希 TLS 客户端 Hello 中的值来帮助识别 TLS 客户端。<br><br>输入：TLS 或 QUIC 客户端 Hello 数据包应用层的十六进制流。";
        this.infoURL = "https://medium.com/foxio/ja4-network-fingerprinting-9376fe9ca637";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "输入格式",
                type: "option",
                value: ["Hex", "Base64", "原始数据"]
            },
            {
                name: "输出格式",
                type: "option",
                value: ["JA4", "JA4 原始渲染", "JA4 原始", "JA4 原始渲染", "全部"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [inputFormat, outputFormat] = args;
        input = Utils.convertToByteArray(input, inputFormat);
        const ja4 = toJA4(new Uint8Array(input));

        // Output
        switch (outputFormat) {
            case "JA4":
                return ja4.JA4;
            case "JA4 原始渲染":
                return ja4.JA4_o;
            case "JA4 原始":
                return ja4.JA4_r;
            case "JA4 原始数据渲染":
                return ja4.JA4_ro;
            case "全部":
            default:
                return `JA4:    ${ja4.JA4}
JA4_o:  ${ja4.JA4_o}
JA4_r:  ${ja4.JA4_r}
JA4_ro: ${ja4.JA4_ro}`;
        }
    }

}

export default JA4Fingerprint;
