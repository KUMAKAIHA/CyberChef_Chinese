/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import gunzip from "zlibjs/bin/gunzip.min.js";

const Zlib = gunzip.Zlib;

/**
 * Gunzip operation
 */
class Gunzip extends Operation {

    /**
     * Gunzip constructor
     */
    constructor() {
        super();

        this.name = "Gunzip";
        this.module = "Compression";
        this.description = "解压缩使用 gzip 头部以 deflate 算法压缩的数据。";
        this.infoURL = "https://wikipedia.org/wiki/Gzip";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.args = [];
        this.checks = [
            {
                pattern: "^\\x1f\\x8b\\x08",
                flags: "",
                args: []
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {File}
     */
    run(input, args) {
        const gzipObj = new Zlib.Gunzip(new Uint8Array(input));
        return new Uint8Array(gzipObj.decompress()).buffer;
    }

}

export default Gunzip;
