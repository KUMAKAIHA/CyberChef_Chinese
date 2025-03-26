/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import { bitOp, xor } from "../lib/BitwiseOp.mjs";
import { toHex } from "../lib/Hex.mjs";
import { isWorkerEnvironment } from "../Utils.mjs";

/**
 * XOR Brute Force operation
 */
class XORBruteForce extends Operation {

    /**
     * XORBruteForce constructor
     */
    constructor() {
        super();

        this.name = "XOR 暴力破解";
        this.module = "Default";
        this.description = "枚举所有可能的 XOR 解决方案。当前最大密钥长度为 2，以保证浏览器性能。<br><br>可选择输入您期望在明文中找到的字符串以过滤结果（关键词）。";
        this.infoURL = "https://wikipedia.org/wiki/Exclusive_or";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                "name": "密钥长度",
                "type": "number",
                "value": 1
            },
            {
                "name": "样本长度",
                "type": "number",
                "value": 100
            },
            {
                "name": "样本偏移",
                "type": "number",
                "value": 0
            },
            {
                "name": "方案",
                "type": "option",
                "value": ["标准", "输入差分", "输出差分"]
            },
            {
                "name": "保留空字符",
                "type": "boolean",
                "value": false
            },
            {
                "name": "打印密钥",
                "type": "boolean",
                "value": true
            },
            {
                "name": "以 Hex 输出",
                "type": "boolean",
                "value": false
            },
            {
                "name": "关键词 (已知明文字符串)",
                "type": "binaryString",
                "value": ""
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        input = new Uint8Array(input);
        const [
                keyLength,
                sampleLength,
                sampleOffset,
                scheme,
                nullPreserving,
                printKey,
                outputHex,
                rawCrib
            ] = args,
            crib = rawCrib.toLowerCase(),
            output = [];
        let result,
            resultUtf8,
            record = "";

        input = input.slice(sampleOffset, sampleOffset + sampleLength);

        if (isWorkerEnvironment())
            self.sendStatusMessage("正在计算 " + Math.pow(256, keyLength) + " 个值...");

        /**
         * Converts an integer to an array of bytes expressing that number.
         *
         * @param {number} int
         * @param {number} len - Length of the resulting array
         * @returns {array}
         */
        const intToByteArray = (int, len) => {
            const res = Array(len).fill(0);
            for (let i = len - 1; i >= 0; i--) {
                res[i] = int & 0xff;
                int = int >>> 8;
            }
            return res;
        };

        for (let key = 1, l = Math.pow(256, keyLength); key < l; key++) {
            if (key % 10000 === 0 && isWorkerEnvironment()) {
                self.sendStatusMessage("正在计算 " + l + " 个值... " + Math.floor(key / l * 100) + "%");
            }

            result = bitOp(input, intToByteArray(key, keyLength), xor, nullPreserving, scheme);
            resultUtf8 = Utils.byteArrayToUtf8(result);
            record = "";

            if (crib && resultUtf8.toLowerCase().indexOf(crib) < 0) continue;
            if (printKey) record += "Key = " + Utils.hex(key, (2*keyLength)) + ": ";
            record += outputHex ? toHex(result) : Utils.escapeWhitespace(resultUtf8);

            output.push(record);
        }

        return output.join("\n");
    }

}

export default XORBruteForce;
