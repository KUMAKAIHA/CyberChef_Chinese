/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import * as OTPAuth from "otpauth";

/**
 * Generate HOTP operation
 */
class GenerateHOTP extends Operation {
    /**
     *
     */
    constructor() {
        super();

        this.name = "生成 HOTP";
        this.module = "Default";
        this.description = "HMAC-基于一次性密码算法 (HOTP) 是一种通过共享密钥和递增计数器计算一次性密码的算法。它已被互联网工程任务组标准 RFC 4226 采纳，是开放认证倡议 (OAUTH) 的基石，并用于许多双因素身份验证系统中。<br><br>请输入密钥作为输入，或留空以生成随机密钥。";
        this.infoURL = "https://wikipedia.org/wiki/HMAC-based_One-time_Password_algorithm";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                "name": "名称",
                "type": "string",
                "value": ""
            },
            {
                "name": "代码长度",
                "type": "number",
                "value": 6
            },
            {
                "name": "计数器",
                "type": "number",
                "value": 0
            }
        ];
    }

    /**
     *
     */
    run(input, args) {
        const secretStr = new TextDecoder("utf-8").decode(input).trim();
        const secret = secretStr ? secretStr.toUpperCase().replace(/\s+/g, "") : "";

        const hotp = new OTPAuth.HOTP({
            issuer: "",
            label: args[0],
            algorithm: "SHA1",
            digits: args[1],
            counter: args[2],
            secret: OTPAuth.Secret.fromBase32(secret)
        });

        const uri = hotp.toString();
        const code = hotp.generate();

        return `URI: ${uri}\n\n密码: ${code}`;
    }
}

export default GenerateHOTP;
