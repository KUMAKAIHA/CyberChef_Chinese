/**
 * @author devcydo [devcydo@gmail.com]
 * @author Ma Bingyao [mabingyao@gmail.com]
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import OperationError from "../errors/OperationError.mjs";
import {decrypt} from "../lib/XXTEA.mjs";

/**
 * XXTEA Decrypt operation
 */
class XXTEADecrypt extends Operation {

    /**
     * XXTEADecrypt constructor
     */
    constructor() {
        super();

        this.name = "XXTEA 解密";
        this.module = "Ciphers";
        this.description = "Corrected Block TEA (通常称为 XXTEA) 是一种块密码，旨在纠正原始 Block TEA 中的弱点。XXTEA 在可变长度块上运行，这些块是 32 位大小的任意倍数（最小 64 位）。完整周期的数量取决于块大小，但至少有六个（对于小块大小则上升到 32 个）。原始 Block TEA 将 XTEA 轮函数应用于块中的每个字，并将其与其最左边的邻居相加组合。解密过程的慢扩散率立即被利用来破解密码。Corrected Block TEA 使用更复杂的轮函数，该函数在处理块中的每个字时都利用了直接邻居。";
        this.infoURL = "https://wikipedia.org/wiki/XXTEA";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.args = [
            {
                "name": "密钥",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const key = new Uint8Array(Utils.convertToByteArray(args[0].string, args[0].option));
        try {
            return decrypt(new Uint8Array(input), key).buffer;
        } catch (err) {
            throw new OperationError("无法使用此密钥解密");
        }
    }

}

export default XXTEADecrypt;
