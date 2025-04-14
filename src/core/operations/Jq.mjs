/**
 * @author zhzy0077 [zhzy0077@hotmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2023
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import jq from "jq-web";

/**
 * jq operation
 */
class Jq extends Operation {

    /**
     * Jq constructor
     */
    constructor() {
        super();

        this.name = "Jq";
        this.module = "Jq";
        this.description = "jq 是一款轻量且灵活的命令行 JSON 处理器。";
        this.infoURL = "https://github.com/jqlang/jq";
        this.inputType = "JSON";
        this.outputType = "string";
        this.args = [
            {
                name: "查询",
                type: "string",
                value: ""
            }
        ];
    }

    /**
     * @param {JSON} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [query] = args;
        let result;

        try {
            result = jq.json(input, query);
        } catch (err) {
            throw new OperationError(`无效的 jq 表达式: ${err.message}`);
        }

        return JSON.stringify(result);
    }

}

export default Jq;
