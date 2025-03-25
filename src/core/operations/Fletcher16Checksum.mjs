/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";

/**
 * Fletcher-16 Checksum operation
 */
class Fletcher16Checksum extends Operation {

    /**
     * Fletcher16Checksum constructor
     */
    constructor() {
        super();

        this.name = "Fletcher-16 校验和";
        this.module = "Crypto";
        this.description = "Fletcher 校验和是由 John Gould Fletcher 于 1970 年代后期在劳伦斯利弗莫尔实验室设计的一种用于计算位置相关的校验和的算法。<br><br>Fletcher 校验和的目标是提供接近循环冗余校验的错误检测性能，但计算工作量更低，与求和技术相关。";
        this.infoURL = "https://wikipedia.org/wiki/Fletcher%27s_checksum#Fletcher-16";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        let a = 0,
            b = 0;
        input = new Uint8Array(input);

        for (let i = 0; i < input.length; i++) {
            a = (a + input[i]) % 0xff;
            b = (b + a) % 0xff;
        }

        return Utils.hex(((b << 8) | a) >>> 0, 4);
    }

}

export default Fletcher16Checksum;
