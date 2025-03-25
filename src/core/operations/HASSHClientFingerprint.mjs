/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2021
 * @license Apache-2.0
 *
 * HASSH created by Salesforce
 *   Ben Reardon (@benreardon)
 *   Adel Karimi (@0x4d31)
 *   and the JA3 crew:
 *     John B. Althouse
 *     Jeff Atkinson
 *     Josh Atkins
 *
 * Algorithm released under the BSD-3-clause licence
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Utils from "../Utils.mjs";
import Stream from "../lib/Stream.mjs";
import {runHash} from "../lib/Hash.mjs";

/**
 * HASSH Client Fingerprint operation
 */
class HASSHClientFingerprint extends Operation {

    /**
     * HASSHClientFingerprint constructor
     */
    constructor() {
        super();

        this.name = "HASSH 客户端指纹";
        this.module = "Crypto";
        this.description = "生成 HASSH 指纹，通过哈希 SSH 客户端密钥交换初始化消息中的值来帮助识别 SSH 客户端。<br><br>输入：来自客户端到服务器的 SSH_MSG_KEXINIT 数据包应用层的十六进制流。";
        this.infoURL = "https://engineering.salesforce.com/open-sourcing-hassh-abed3ae5044c";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "输入格式",
                type: "option",
                value: ["Hex", "Base64", "Raw"]
            },
            {
                name: "输出格式",
                type: "option",
                value: ["哈希摘要", "HASSH 算法字符串", "完整详情"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [inputFormat, outputFormat] = args;

        input = Utils.convertToByteArray(input, inputFormat);
        const s = new Stream(new Uint8Array(input));

        // Length
        const length = s.readInt(4);
        if (s.length !== length + 4)
            throw new OperationError("Incorrect packet length.");

        // Padding length
        const paddingLength = s.readInt(1);

        // Message code
        const messageCode = s.readInt(1);
        if (messageCode !== 20)
            throw new OperationError("Not a Key Exchange Init.");

        // Cookie
        s.moveForwardsBy(16);

        // KEX Algorithms
        const kexAlgosLength = s.readInt(4);
        const kexAlgos = s.readString(kexAlgosLength);

        // Server Host Key Algorithms
        const serverHostKeyAlgosLength = s.readInt(4);
        s.moveForwardsBy(serverHostKeyAlgosLength);

        // Encryption Algorithms Client to Server
        const encAlgosC2SLength = s.readInt(4);
        const encAlgosC2S = s.readString(encAlgosC2SLength);

        // Encryption Algorithms Server to Client
        const encAlgosS2CLength = s.readInt(4);
        s.moveForwardsBy(encAlgosS2CLength);

        // MAC Algorithms Client to Server
        const macAlgosC2SLength = s.readInt(4);
        const macAlgosC2S = s.readString(macAlgosC2SLength);

        // MAC Algorithms Server to Client
        const macAlgosS2CLength = s.readInt(4);
        s.moveForwardsBy(macAlgosS2CLength);

        // Compression Algorithms Client to Server
        const compAlgosC2SLength = s.readInt(4);
        const compAlgosC2S = s.readString(compAlgosC2SLength);

        // Compression Algorithms Server to Client
        const compAlgosS2CLength = s.readInt(4);
        s.moveForwardsBy(compAlgosS2CLength);

        // Languages Client to Server
        const langsC2SLength = s.readInt(4);
        s.moveForwardsBy(langsC2SLength);

        // Languages Server to Client
        const langsS2CLength = s.readInt(4);
        s.moveForwardsBy(langsS2CLength);

        // First KEX packet follows
        s.moveForwardsBy(1);

        // Reserved
        s.moveForwardsBy(4);

        // Padding string
        s.moveForwardsBy(paddingLength);

        // Output
        const hassh = [
            kexAlgos,
            encAlgosC2S,
            macAlgosC2S,
            compAlgosC2S
        ];
        const hasshStr = hassh.join(";");
        const hasshHash = runHash("md5", Utils.strToArrayBuffer(hasshStr));

        switch (outputFormat) {
            case "HASSH 算法字符串":
                return hasshStr;
            case "完整详情":
                return `哈希摘要：
${hasshHash}

完整 HASSH 算法字符串：
${hasshStr}

密钥交换算法：
${kexAlgos}
加密算法（客户端到服务器）：
${encAlgosC2S}
MAC 算法（客户端到服务器）：
${macAlgosC2S}
压缩算法（客户端到服务器）：
${compAlgosC2S}`;
            case "哈希摘要":
            default:
                return hasshHash;
        }
    }

}

export default HASSHClientFingerprint;
