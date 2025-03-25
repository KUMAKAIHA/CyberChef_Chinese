/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import crypto from "crypto";

/**
 * Generate UUID operation
 */
class GenerateUUID extends Operation {

    /**
     * GenerateUUID constructor
     */
    constructor() {
        super();

        this.name = "生成 UUID";
        this.module = "加密 / 编码";
        this.description = "生成符合 RFC 4122 版本 4 标准的通用唯一识别码 (UUID)，也称为全局唯一识别码 (GUID)。<br><br>版本 4 UUID 依赖于随机数，本操作会尝试使用 <code>window.crypto</code> 生成随机数，如果不可用则回退到 <code>Math.random</code>。";
        this.infoURL = "https://wikipedia.org/wiki/Universally_unique_identifier";
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
        const buf = new Uint32Array(4).map(() => {
            return crypto.randomBytes(4).readUInt32BE(0, true);
        });
        let i = 0;
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
            const r = (buf[i >> 3] >> ((i % 8) * 4)) & 0xf,
                v = c === "x" ? r : (r & 0x3 | 0x8);
            i++;
            return v.toString(16);
        });
    }

}

export default GenerateUUID;
