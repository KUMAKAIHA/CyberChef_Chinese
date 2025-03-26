/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import bcrypt from "bcryptjs";
import { isWorkerEnvironment } from "../Utils.mjs";

/**
 * Bcrypt operation
 */
class Bcrypt extends Operation {

    /**
     * Bcrypt constructor
     */
    constructor() {
        super();

        this.name = "Bcrypt";
        this.module = "Crypto";
        this.description = "bcrypt是由Niels Provos和David Mazieres设计的密码哈希函数，它基于Blowfish密码，并在1999年的USENIX上提出。除了使用盐来防止彩虹表攻击外，bcrypt还是一个自适应函数：随着时间的推移，可以增加迭代计数（轮数）使其速度变慢，从而即使计算能力不断增强，它仍然能够抵抗暴力搜索攻击。<br><br>在输入框中输入密码以生成其哈希值。";
        this.infoURL = "https://wikipedia.org/wiki/Bcrypt";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "轮数",
                "type": "number",
                "value": 10
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    async run(input, args) {
        const rounds = args[0];
        const salt = await bcrypt.genSalt(rounds);

        return await bcrypt.hash(input, salt, null, p => {
            // Progress callback
            if (isWorkerEnvironment())
                self.sendStatusMessage(`进度: ${(p * 100).toFixed(0)}%`);
        });

    }

}

export default Bcrypt;
