/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import JSSHA3 from "js-sha3";
import OperationError from "../errors/OperationError.mjs";

/**
 * SHA3 operation
 */
class SHA3 extends Operation {

    /**
     * SHA3 constructor
     */
    constructor() {
        super();

        this.name = "SHA3";
        this.module = "Crypto";
        this.description = "SHA-3（安全哈希算法 3）哈希函数于 2015 年 8 月 5 日由 NIST 发布。虽然 SHA-3 与 SHA-1 和 SHA-2 属于同一系列标准，但其内部结构与 MD5 类似的结构截然不同。<br><br>SHA-3 是更广泛的密码学原语族 Keccak 的一个子集，Keccak 由 Guido Bertoni、Joan Daemen、Michaël Peeters 和 Gilles Van Assche 设计，基于 RadioGatún。";
        this.infoURL = "https://wikipedia.org/wiki/SHA-3";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                "name": "大小",
                "type": "option",
                "value": ["512", "384", "256", "224"]
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const size = parseInt(args[0], 10);
        let algo;

        switch (size) {
            case 224:
                algo = JSSHA3.sha3_224;
                break;
            case 384:
                algo = JSSHA3.sha3_384;
                break;
            case 256:
                algo = JSSHA3.sha3_256;
                break;
            case 512:
                algo = JSSHA3.sha3_512;
                break;
            default:
                throw new OperationError("Invalid size");
        }

        return algo(input);
    }

}

export default SHA3;
