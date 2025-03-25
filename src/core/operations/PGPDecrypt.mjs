/**
 * @author tlwr [toby@toby.codes]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import kbpgp from "kbpgp";
import { ASP, importPrivateKey } from "../lib/PGP.mjs";
import OperationError from "../errors/OperationError.mjs";
import * as es6promisify from "es6-promisify";
const promisify = es6promisify.default ? es6promisify.default.promisify : es6promisify.promisify;

/**
 * PGP Decrypt operation
 */
class PGPDecrypt extends Operation {

    /**
     * PGPDecrypt constructor
     */
    constructor() {
        super();

        this.name = "PGP 解密";
        this.module = "PGP";
        this.description = [
            "输入：您想要解密的 ASCII 编码 PGP 消息。",
            "<br><br>",
            "参数：接收者的 ASCII 编码 PGP 私钥，",
            "（以及私钥密码，如果需要）。",
            "<br><br>",
            "Pretty Good Privacy (PGP) 是一种加密标准 (OpenPGP)，用于加密、解密和签名消息。",
            "<br><br>",
            "此操作使用 Keybase 实现的 PGP。",
        ].join("\n");
        this.infoURL = "https://wikipedia.org/wiki/Pretty_Good_Privacy";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "接收者的私钥",
                "type": "text",
                "value": ""
            },
            {
                "name": "私钥密码",
                "type": "string",
                "value": ""
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     *
     * @throws {OperationError} if invalid private key
     */
    async run(input, args) {
        const encryptedMessage = input,
            [privateKey, passphrase] = args,
            keyring = new kbpgp.keyring.KeyRing();
        let plaintextMessage;

        if (!privateKey) throw new OperationError("Enter the private key of the recipient.");

        const key = await importPrivateKey(privateKey, passphrase);
        keyring.add_key_manager(key);

        try {
            plaintextMessage = await promisify(kbpgp.unbox)({
                armored: encryptedMessage,
                keyfetch: keyring,
                asp: ASP
            });
        } catch (err) {
            throw new OperationError(`Couldn't decrypt message with provided private key: ${err}`);
        }

        return plaintextMessage.toString();
    }

}

export default PGPDecrypt;
