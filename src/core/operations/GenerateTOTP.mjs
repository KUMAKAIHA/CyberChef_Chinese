/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import * as OTPAuth from "otpauth";

/**
 * Generate TOTP operation
 */
class GenerateTOTP extends Operation {
    /**
     *
     */
    constructor() {
        super();
        this.name = "生成 TOTP";
        this.module = "Default";
        this.description = "基于时间的一次性密码算法 (TOTP) 是一种从共享密钥和当前时间计算一次性密码的算法。它已被互联网工程任务组标准 RFC 6238 采纳，是开放认证倡议 (OAUTH) 的基石，并用于许多双因素身份验证系统中。TOTP 是一种 HOTP，其中计数器是当前时间。<br><br>输入密钥作为输入，或留空以生成随机密钥。T0 和 T1 以秒为单位。";
        this.infoURL = "https://wikipedia.org/wiki/Time-based_One-time_Password_algorithm";
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
                "name": "Epoch 偏移量 (T0)",
                "type": "number",
                "value": 0
            },
            {
                "name": "间隔 (T1)",
                "type": "number",
                "value": 30
            }
        ];
    }

    /**
     *
     */
    run(input, args) {
        const secretStr = new TextDecoder("utf-8").decode(input).trim();
        const secret = secretStr ? secretStr.toUpperCase().replace(/\s+/g, "") : "";

        const totp = new OTPAuth.TOTP({
            issuer: "",
            label: args[0],
            algorithm: "SHA1",
            digits: args[1],
            period: args[3],
            epoch: args[2] * 1000, // Convert seconds to milliseconds
            secret: OTPAuth.Secret.fromBase32(secret)
        });

        const uri = totp.toString();
        const code = totp.generate();

        return `URI: ${uri}\n\n密码: ${code}`;
    }
}

export default GenerateTOTP;
