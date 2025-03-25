/**
 * @author tlwr [toby@toby.codes]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import kbpgp from "kbpgp";
import { ASP, importPublicKey } from "../lib/PGP.mjs";
import OperationError from "../errors/OperationError.mjs";
import * as es6promisify from "es6-promisify";
const promisify = es6promisify.default ? es6promisify.default.promisify : es6promisify.promisify;

/**
 * PGP Encrypt operation
 */
class PGPEncrypt extends Operation {

    /**
     * PGPEncrypt constructor
     */
    constructor() {
        super();

        this.name = "PGP 加密";
        this.module = "PGP";
        this.description = [
            "输入：您想要加密的消息。",
            "<br><br>",
            "参数：接收者的 ASCII 编码 PGP 公钥。",
            "<br><br>",
            "Pretty Good Privacy (PGP) 是一种用于加密、解密和签名消息的加密标准 (OpenPGP)。",
            "<br><br>",
            "此功能使用 PGP 的 Keybase 实现。",
        ].join("\n");
        this.infoURL = "https://wikipedia.org/wiki/Pretty_Good_Privacy";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "接收者的公钥",
                "type": "text",
                "value": ""
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     *
     * @throws {OperationError} if failed private key import or failed encryption
     */
    async run(input, args) {
        const plaintextMessage = input,
            plainPubKey = args[0];
        let encryptedMessage;

        if (!plainPubKey) throw new OperationError("请输入接收者的公钥。");

        const key = await importPublicKey(plainPubKey);

        try {
            encryptedMessage = await promisify(kbpgp.box)({
                "msg": plaintextMessage,
                "encrypt_for": key,
                "asp": ASP
            });
        } catch (err) {
            throw new OperationError(`无法使用提供的公钥加密消息: ${err}`);
        }

        return encryptedMessage.toString();
    }

}

export default PGPEncrypt;
