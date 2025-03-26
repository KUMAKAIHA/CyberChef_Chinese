/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import ssdeepjs from "ssdeep.js";

/**
 * SSDEEP operation
 */
class SSDEEP extends Operation {

    /**
     * SSDEEP constructor
     */
    constructor() {
        super();

        this.name = "SSDEEP";
        this.module = "Crypto";
        this.description = "SSDEEP 是一个用于计算上下文触发分段哈希 (CTPH) 的程序。CTPH 也被称为模糊哈希，可以匹配具有同源性的输入。这类输入具有相同顺序的相同字节序列，但这些序列之间的字节在内容和长度上可能有所不同。<br><br>SSDEEP 哈希值目前被广泛用于简单的识别目的（例如 VirusTotal 中的“基本属性”部分）。尽管有“更好”的模糊哈希可用，但 SSDEEP 仍然是主要选择之一，因为它速度快并且是事实上的标准。<br><br>此操作在本质上与 CTPH 操作相同，但它们的输出格式不同。";
        this.infoURL = "https://forensics.wiki/ssdeep";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        return ssdeepjs.digest(input);
    }

}

export default SSDEEP;
