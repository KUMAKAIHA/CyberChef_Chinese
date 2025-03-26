/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2023
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Utils from "../Utils.mjs";
import { toHexFast, fromHex } from "../lib/Hex.mjs";
import { CryptoGost, GostEngine } from "@wavesenterprise/crypto-gost-js/index.js";

/**
 * GOST Encrypt operation
 */
class GOSTEncrypt extends Operation {

    /**
     * GOSTEncrypt constructor
     */
    constructor() {
        super();

        this.name = "GOST 加密";
        this.module = "Ciphers";
        this.description = "GOST 分组密码（Magma）在 GOST 28147-89 (RFC 5830) 标准中定义，是苏联和俄罗斯政府标准的对称密钥分组密码，分组大小为 64 位。最初的标准于 1989 年发布，没有给该密码命名，但最新修订的标准 GOST R 34.12-2015 (RFC 7801, RFC 8891) 规定可以将其称为 Magma。GOST 哈希函数基于此密码。新标准还规定了一种新的 128 位分组密码，称为 Kuznyechik。<br><br>该标准在 1970 年代开发，最初被标记为“绝密”，然后在 1990 年降级为“秘密”。苏联解体后不久，它被解密，并于 1994 年公开发布。GOST 28147 是美国标准算法 DES 的苏联替代方案。因此，两者在结构上非常相似。";
        this.infoURL = "https://wikipedia.org/wiki/GOST_(block_cipher)";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "密钥",
                type: "toggleString",
                value: "",
                toggleValues: ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                name: "初始向量 (IV)",
                type: "toggleString",
                value: "",
                toggleValues: ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                name: "输入类型",
                type: "option",
                value: ["Raw", "Hex"]
            },
            {
                name: "输出类型",
                type: "option",
                value: ["Hex", "Raw"]
            },
            {
                name: "算法",
                type: "argSelector",
                value: [
                    {
                        name: "GOST 28147 (1989)",
                        on: [5]
                    },
                    {
                        name: "GOST R 34.12 (Magma, 2015)",
                        off: [5]
                    },
                    {
                        name: "GOST R 34.12 (Kuznyechik, 2015)",
                        off: [5]
                    }
                ]
            },
            {
                name: "S-盒",
                type: "option",
                value: ["E-TEST", "E-A", "E-B", "E-C", "E-D", "E-SC", "E-Z", "D-TEST", "D-A", "D-SC"]
            },
            {
                name: "分组模式",
                type: "option",
                value: ["ECB", "CFB", "OFB", "CTR", "CBC"]
            },
            {
                name: "密钥网格模式",
                type: "option",
                value: ["NO", "CP"]
            },
            {
                name: "填充",
                type: "option",
                value: ["NO", "PKCS5", "ZERO", "RANDOM", "BIT"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    async run(input, args) {
        const [keyObj, ivObj, inputType, outputType, version, sBox, blockMode, keyMeshing, padding] = args;

        const key = toHexFast(Utils.convertToByteArray(keyObj.string, keyObj.option));
        const iv = toHexFast(Utils.convertToByteArray(ivObj.string, ivObj.option));
        input = inputType === "Hex" ? input : toHexFast(Utils.strToArrayBuffer(input));

        let blockLength, versionNum;
        switch (version) {
            case "GOST 28147 (1989)":
                versionNum = 1989;
                blockLength = 64;
                break;
            case "GOST R 34.12 (Magma, 2015)":
                versionNum = 2015;
                blockLength = 64;
                break;
            case "GOST R 34.12 (Kuznyechik, 2015)":
                versionNum = 2015;
                blockLength = 128;
                break;
            default:
                throw new OperationError(`未知的算法版本: ${version}`);
        }

        const sBoxVal = versionNum === 1989 ? sBox : null;

        const algorithm = {
            version: versionNum,
            length: blockLength,
            mode: "ES",
            sBox: sBoxVal,
            block: blockMode,
            keyMeshing: keyMeshing,
            padding: padding
        };

        try {
            const Hex = CryptoGost.coding.Hex;
            if (iv) algorithm.iv = Hex.decode(iv);

            const cipher = GostEngine.getGostCipher(algorithm);
            const out = Hex.encode(cipher.encrypt(Hex.decode(key), Hex.decode(input)));

            return outputType === "Hex" ? out : Utils.byteArrayToChars(fromHex(out));
        } catch (err) {
            throw new OperationError(err);
        }
    }

}

export default GOSTEncrypt;
