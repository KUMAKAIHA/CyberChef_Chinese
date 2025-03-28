/**
 * @author Matt C [me@mitt.dev]
 * @copyright Crown Copyright 2022
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import {decompress} from "@blu3r4y/lzma";
import Utils, {isWorkerEnvironment} from "../Utils.mjs";

/**
 * LZMA Decompress operation
 */
class LZMADecompress extends Operation {

    /**
     * LZMADecompress constructor
     */
    constructor() {
        super();

        this.name = "LZMA 解压缩";
        this.module = "Compression";
        this.description = "使用 Lempel-Ziv-Markov 链算法解压缩数据。";
        this.infoURL = "https://wikipedia.org/wiki/Lempel%E2%80%93Ziv%E2%80%93Markov_chain_algorithm";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {ArrayBuffer}
     */
    async run(input, args) {
        return new Promise((resolve, reject) => {
            decompress(new Uint8Array(input), (result, error) => {
                if (error) {
                    reject(new OperationError(`Failed to decompress input: ${error.message}`));
                }
                // The decompression returns either a String or an untyped unsigned int8 array, but we can just get the unsigned data from the buffer

                if (typeof result == "string") {
                    resolve(Utils.strToArrayBuffer(result));
                } else {
                    resolve(new Int8Array(result).buffer);
                }
            }, (percent) => {
                if (isWorkerEnvironment()) self.sendStatusMessage(`解压缩输入数据: ${(percent*100).toFixed(2)}%`);
            });
        });
    }

}

export default LZMADecompress;
