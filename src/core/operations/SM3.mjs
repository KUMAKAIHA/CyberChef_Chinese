/**
 * @author n1073645 [n1073645@gmail.com]
 * @copyright Crown Copyright 2020
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import Sm3 from "crypto-api/src/hasher/sm3.mjs";
import {toHex} from "crypto-api/src/encoder/hex.mjs";

/**
 * SM3 operation
 */
class SM3 extends Operation {

    /**
     * SM3 constructor
     */
    constructor() {
        super();

        this.name = "SM3";
        this.module = "Crypto";
        this.description = "SM3 是一种用于中国国家标准的密码散列函数。SM3 主要用于数字签名、消息认证码和伪随机数生成器。默认情况下，消息摘要算法由 64 轮组成，长度为 256 位。";
        this.infoURL = "https://wikipedia.org/wiki/SM3_(hash_function)";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                name: "长度",
                type: "number",
                value: 256
            },
            {
                name: "轮数",
                type: "number",
                value: 64,
                min: 16
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const msg = Utils.arrayBufferToStr(input, false);
        const hasher = new Sm3({length: args[0], rounds: args[1]});
        hasher.update(msg);
        return toHex(hasher.finalize());
    }
}

export default SM3;
