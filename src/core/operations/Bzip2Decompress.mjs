/**
 * @author Matt C [me@mitt.dev]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Bzip2 from "libbzip2-wasm";
import { isWorkerEnvironment } from "../Utils.mjs";

/**
 * Bzip2 Decompress operation
 */
class Bzip2Decompress extends Operation {

    /**
     * Bzip2Decompress constructor
     */
    constructor() {
        super();

        this.name = "Bzip2 解压缩";
        this.module = "Compression";
        this.description = "使用 Bzip2 算法解压缩数据。";
        this.infoURL = "https://wikipedia.org/wiki/Bzip2";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.args = [
            {
                name: "使用低内存、较慢的解压缩算法",
                type: "boolean",
                value: false
            }
        ];
        this.checks = [
            {
                "pattern": "^\\x42\\x5a\\x68",
                "flags": "",
                "args": []
            }
        ];
    }

    /**
     * @param {byteArray} input
     * @param {Object[]} args
     * @returns {string}
     */
    async run(input, args) {
        const [small] = args;
        if (input.byteLength <= 0) {
            throw new OperationError("请提供输入。");
        }
        if (isWorkerEnvironment()) self.sendStatusMessage("正在加载 Bzip2...");
        return new Promise((resolve, reject) => {
            Bzip2().then(bzip2 => {
                if (isWorkerEnvironment()) self.sendStatusMessage("正在解压缩数据...");
                const inpArray = new Uint8Array(input);
                const bzip2cc = bzip2.decompressBZ2(inpArray, small ? 1 : 0);
                if (bzip2cc.error !== 0) {
                    reject(new OperationError(bzip2cc.error_msg));
                } else {
                    const output = bzip2cc.output;
                    resolve(output.buffer.slice(output.byteOffset, output.byteLength + output.byteOffset));
                }
            });
        });
    }

}

export default Bzip2Decompress;
