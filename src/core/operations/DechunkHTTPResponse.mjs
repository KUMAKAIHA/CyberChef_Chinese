/**
 * @author sevzero [sevzero@protonmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Dechunk HTTP response operation
 */
class DechunkHTTPResponse extends Operation {

    /**
     * DechunkHTTPResponse constructor
     */
    constructor() {
        super();

        this.name = "反分块 HTTP 响应";
        this.module = "Default";
        this.description = "解析使用 Transfer-Encoding: Chunked 传输的 HTTP 响应";
        this.infoURL = "https://wikipedia.org/wiki/Chunked_transfer_encoding";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [];
        this.checks = [
            {
                pattern:  "^[0-9A-F]+\r\n",
                flags:  "i",
                args:   []
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const chunks = [];
        let chunkSizeEnd = input.indexOf("\n") + 1;
        const lineEndings = input.charAt(chunkSizeEnd - 2) === "\r" ? "\r\n" : "\n";
        const lineEndingsLength = lineEndings.length;
        let chunkSize = parseInt(input.slice(0, chunkSizeEnd), 16);
        while (!isNaN(chunkSize)) {
            chunks.push(input.slice(chunkSizeEnd, chunkSize + chunkSizeEnd));
            input = input.slice(chunkSizeEnd + chunkSize + lineEndingsLength);
            chunkSizeEnd = input.indexOf(lineEndings) + lineEndingsLength;
            chunkSize = parseInt(input.slice(0, chunkSizeEnd), 16);
        }
        return chunks.join("") + input;
    }

}

export default DechunkHTTPResponse;
