/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import {fromHex} from "../lib/Hex.mjs";

/**
 * From Hex Content operation
 */
class FromHexContent extends Operation {

    /**
     * FromHexContent constructor
     */
    constructor() {
        super();

        this.name = "从 Hex 内容 转换";
        this.module = "Default";
        this.description = "将文本中的十六进制字节转换回原始字节。SNORT 使用此格式在 ASCII 文本中表示十六进制数据。<br><br>例如：<code>foo|3d|bar</code> 转换为 <code>foo=bar</code>。";
        this.infoURL = "http://manual-snort-org.s3-website-us-east-1.amazonaws.com/node32.html#SECTION00451000000000000000";
        this.inputType = "string";
        this.outputType = "byteArray";
        this.args = [];
        this.checks = [
            {
                pattern:  "\\|([\\da-f]{2} ?)+\\|",
                flags:  "i",
                args:   []
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        const regex = /\|([a-f\d ]{2,})\|/gi,
            output = [];
        let m, i = 0;
        while ((m = regex.exec(input))) {
            // Add up to match
            for (; i < m.index;)
                output.push(Utils.ord(input[i++]));

            // Add match
            const bytes = fromHex(m[1]);
            if (bytes) {
                for (let a = 0; a < bytes.length;)
                    output.push(bytes[a++]);
            } else {
                // Not valid hex, print as normal
                for (; i < regex.lastIndex;)
                    output.push(Utils.ord(input[i++]));
            }

            i = regex.lastIndex;
        }
        // Add all after final match
        for (; i < input.length;)
            output.push(Utils.ord(input[i++]));

        return output;
    }

}

export default FromHexContent;
