/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Encode NetBIOS Name operation
 */
class EncodeNetBIOSName extends Operation {

    /**
     * EncodeNetBIOSName constructor
     */
    constructor() {
        super();

        this.name = "NetBIOS 名称编码";
        this.module = "Default";
        this.description = "在客户端 NetBIOS 接口中看到的 NetBIOS 名称长度正好为 16 字节。在 NetBIOS-over-TCP 协议中，则使用更长的表示形式。<br><br>编码分为两个级别。第一个级别将 NetBIOS 名称映射到域名系统名称。第二个级别将域名系统名称映射到与域名系统交互所需的“压缩”表示形式。<br><br>此操作执行第一级编码。有关完整详细信息，请参见 RFC 1001。";
        this.infoURL = "https://wikipedia.org/wiki/NetBIOS";
        this.inputType = "byteArray";
        this.outputType = "byteArray";
        this.args = [
            {
                "name": "偏移量",
                "type": "number",
                "value": 65
            }
        ];
    }

    /**
     * @param {byteArray} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        const output = [],
            offset = args[0];

        if (input.length <= 16) {
            const len = input.length;
            input.length = 16;
            input.fill(32, len, 16);
            for (let i = 0; i < input.length; i++) {
                output.push((input[i] >> 4) + offset);
                output.push((input[i] & 0xf) + offset);
            }
        }

        return output;

    }

}

export default EncodeNetBIOSName;
