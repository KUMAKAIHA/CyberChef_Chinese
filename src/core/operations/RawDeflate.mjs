/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {COMPRESSION_TYPE} from "../lib/Zlib.mjs";
import rawdeflate from "zlibjs/bin/rawdeflate.min.js";

const Zlib = rawdeflate.Zlib;

const RAW_COMPRESSION_TYPE_LOOKUP = {
    "Fixed Huffman Coding":   Zlib.RawDeflate.CompressionType.FIXED,
    "Dynamic Huffman Coding": Zlib.RawDeflate.CompressionType.DYNAMIC,
    "None (Store)":           Zlib.RawDeflate.CompressionType.NONE,
};

/**
 * Raw Deflate operation
 */
class RawDeflate extends Operation {

    /**
     * RawDeflate constructor
     */
    constructor() {
        super();

        this.name = "原始 Deflate";
        this.module = "Compression";
        this.description = "使用 DEFLATE 算法压缩数据，不包含头部信息。";
        this.infoURL = "https://wikipedia.org/wiki/DEFLATE";
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
        const deflate = new Zlib.RawDeflate(new Uint8Array(input), {
            compressionType: RAW_COMPRESSION_TYPE_LOOKUP[args[0]]
        });
        return new Uint8Array(deflate.compress()).buffer;
    }

}

export default RawDeflate;
