/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {COMPRESSION_TYPE, ZLIB_COMPRESSION_TYPE_LOOKUP} from "../lib/Zlib.mjs";
import zlibAndGzip from "zlibjs/bin/zlib_and_gzip.min.js";

const Zlib = zlibAndGzip.Zlib;

/**
 * Zlib Deflate operation
 */
class ZlibDeflate extends Operation {

    /**
     * ZlibDeflate constructor
     */
    constructor() {
        super();

        this.name = "Zlib Deflate";
        this.module = "Compression";
        this.description = "使用 deflate 算法压缩数据并添加 zlib 头部。";
        this.infoURL = "https://wikipedia.org/wiki/Zlib";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.args = [
            {
                name: "压缩类型",
                type: "option",
                value: COMPRESSION_TYPE
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {ArrayBuffer}
     */
    run(input, args) {
        const deflate = new Zlib.Deflate(new Uint8Array(input), {
            compressionType: ZLIB_COMPRESSION_TYPE_LOOKUP[args[0]]
        });
        return new Uint8Array(deflate.compress()).buffer;
    }

}

export default ZlibDeflate;
