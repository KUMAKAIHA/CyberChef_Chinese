/**
 * @author Tan Zhen Yong [tzy@beyondthesprawl.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import argon2 from "argon2-browser";

/**
 * Argon2 compare operation
 */
class Argon2Compare extends Operation {

    /**
     * Argon2Compare constructor
     */
    constructor() {
        super();

        this.name = "Argon2 比较";
        this.module = "Crypto";
        this.description = "测试输入是否与给定的 Argon2 哈希匹配。要测试多个可能的密码，请使用“Fork”操作。";
        this.infoURL = "https://wikipedia.org/wiki/Argon2";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "编码哈希",
                "type": "string",
                "value": ""
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    async run(input, args) {
        const encoded = args[0];

        try {
            await argon2.verify({
                pass: input,
                encoded
            });

            return `匹配: ${input}`;
        } catch (err) {
            return "不匹配";
        }
    }

}

export default Argon2Compare;
