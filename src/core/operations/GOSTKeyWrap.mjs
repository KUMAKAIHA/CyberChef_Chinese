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
 * GOST Key Wrap operation
 */
class GOSTKeyWrap extends Operation {

    /**
     * GOSTKeyWrap constructor
     */
    constructor() {
        super();

        this.name = "GOST 密钥封装";
        this.module = "Ciphers";
        this.description = "使用 GOST 块密码之一保护非可信存储中密钥的密钥封装算法。";
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
                name: "用户密钥材料",
                type: "toggleString",
                value: "",
                toggleValues: ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                name: "输入类型",
                type: "option",
                value: ["原始数据", "Hex"]
            },
            {
                name: "输出类型",
                type: "option",
                value: ["Hex", "原始数据"]
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
                name: "sBox",
                type: "option",
                value: ["E-TEST", "E-A", "E-B", "E-C", "E-D", "E-SC", "E-Z", "D-TEST", "D-A", "D-SC"]
            },
            {
                name: "密钥封装方式",
                type: "option",
                value: ["NO", "CP", "SC"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    async run(input, args) {
        const [keyObj, ukmObj, inputType, outputType, version, sBox, keyWrapping] = args;

        const key = toHexFast(Utils.convertToByteArray(keyObj.string, keyObj.option));
        const ukm = toHexFast(Utils.convertToByteArray(ukmObj.string, ukmObj.option));
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
                throw new OperationError(`Unknown algorithm version: ${version}`);
        }

        const sBoxVal = versionNum === 1989 ? sBox : null;

        const algorithm = {
            version: versionNum,
            length: blockLength,
            mode: "KW",
            sBox: sBoxVal,
            keyWrapping: keyWrapping
        };

        try {
            const Hex = CryptoGost.coding.Hex;
            algorithm.ukm = Hex.decode(ukm);

            const cipher = GostEngine.getGostCipher(algorithm);
            const out = Hex.encode(cipher.wrapKey(Hex.decode(key), Hex.decode(input)));

            return outputType === "Hex" ? out : Utils.byteArrayToChars(fromHex(out));
        } catch (err) {
            if (err.toString().includes("Invalid typed array length")) {
                throw new OperationError("Incorrect input length. Must be a multiple of the block size.");
            }
            throw new OperationError(err);
        }
    }

}

export default GOSTKeyWrap;
