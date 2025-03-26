/**
 * @author tcode2k16 [tcode2k16@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import ieee754 from "ieee754";
import {DELIM_OPTIONS} from "../lib/Delim.mjs";

/**
 * From Float operation
 */
class FromFloat extends Operation {

    /**
     * FromFloat constructor
     */
    constructor() {
        super();

        this.name = "从 浮点数 转换";
        this.module = "Default";
        this.description = "从 IEEE754 浮点数转换";
        this.infoURL = "https://wikipedia.org/wiki/IEEE_754";
        this.inputType = "string";
        this.outputType = "byteArray";
        this.args = [
            {
                "name": "字节序",
                "type": "option",
                "value": [
                    "大端序",
                    "小端序"
                ]
            },
            {
                "name": "大小",
                "type": "option",
                "value": [
                    "单精度浮点数 (4 字节)",
                    "双精度浮点数 (8 字节)"
                ]
            },
            {
                "name": "分隔符",
                "type": "option",
                "value": DELIM_OPTIONS
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        if (input.length === 0) return [];

        const [endianness, size, delimiterName] = args;
        const delim = Utils.charRep(delimiterName || "Space");
        const byteSize = size === "双精度浮点数 (8 字节)" ? 8 : 4;
        const isLE = endianness === "小端序";
        const mLen = byteSize === 4 ? 23 : 52;
        const floats = input.split(delim);

        const output = new Array(floats.length*byteSize);
        for (let i = 0; i < floats.length; i++) {
            ieee754.write(output, parseFloat(floats[i]), i*byteSize, isLE, mLen, byteSize);
        }
        return output;
    }

}

export default FromFloat;
