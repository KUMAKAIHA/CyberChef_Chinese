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
 * Bcrypt compare operation
 */
class BcryptCompare extends Operation {

    /**
     * BcryptCompare constructor
     */
    constructor() {
        super();

        this.name = "Bcrypt 比较";
        this.module = "Crypto";
        this.description = "测试输入是否与给定的 Bcrypt 哈希值匹配。要测试多个可能的密码，请使用 'Fork' 操作。";
        this.infoURL = "https://wikipedia.org/wiki/Bcrypt";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "哈希值",
                "type": "string",
                "value": ""
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    async run(input, args) {
        const hash = args[0];

        const match = await bcrypt.compare(input, hash, null, p => {
            // Progress callback
            if (isWorkerEnvironment())
                self.sendStatusMessage(`进度: ${(p * 100).toFixed(0)}%`);
        });

        return match ? "匹配： " + input : "不匹配";

    }

}

export default BcryptCompare;
