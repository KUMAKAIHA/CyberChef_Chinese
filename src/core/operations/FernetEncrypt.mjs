/**
 * @author Karsten Silkenbäumer [github.com/kassi]
 * @copyright Karsten Silkenbäumer 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import fernet from "fernet";

/**
 * FernetEncrypt operation
 */
class FernetEncrypt extends Operation {
    /**
     * FernetEncrypt constructor
     */
    constructor() {
        super();

        this.name = "Fernet 加密";
        this.module = "Default";
        this.description = "Fernet 是一种对称加密方法，确保加密后的消息在没有密钥的情况下无法被篡改/读取。它对密钥使用 URL 安全编码。Fernet 使用 128 位 AES 在 CBC 模式和 PKCS7 填充下进行加密，并使用 HMAC 及 SHA256 进行身份验证。IV 由 os.random() 生成。<br><br><b>密钥:</b> 密钥必须是 32 字节（256 位），并使用 Base64 编码。";
        this.infoURL = "https://asecuritysite.com/encryption/fer";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "密钥",
                "type": "string",
                "value": ""
            },
        ];
    }
    /**
     * @param {String} input
     * @param {Object[]} args
     * @returns {String}
     */
    run(input, args) {
        const [secretInput] = args;
        try {
            const secret = new fernet.Secret(secretInput);
            const token = new fernet.Token({
                secret: secret,
            });
            return token.encode(input);
        } catch (err) {
            throw new OperationError(err);
        }
    }
}

export default FernetEncrypt;
