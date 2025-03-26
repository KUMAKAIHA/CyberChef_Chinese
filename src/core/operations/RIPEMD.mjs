/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {runHash} from "../lib/Hash.mjs";

/**
 * RIPEMD operation
 */
class RIPEMD extends Operation {

    /**
     * RIPEMD constructor
     */
    constructor() {
        super();

        this.name = "RIPEMD";
        this.module = "Crypto";
        this.description = "RIPEMD（RACE Integrity Primitives Evaluation Message Digest，RACE 完整性原语评估消息摘要）是由比利时鲁汶的 Hans Dobbertin、Antoon Bosselaers 和 Bart Preneel 在鲁汶天主教大学 COSIC 研究小组开发的密码学哈希函数系列，于 1996 年首次发布。<br><br>RIPEMD 基于 MD4 中使用的设计原则，并且性能与更流行的 SHA-1 相似。<br><br>";
        this.infoURL = "https://wikipedia.org/wiki/RIPEMD";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                "name": "大小",
                "type": "option",
                "value": ["320", "256", "160", "128"]
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const size = args[0];
        return runHash("ripemd" + size, input);
    }

}

export default RIPEMD;
