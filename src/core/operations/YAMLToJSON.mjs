/**
 * @author ccarpo [ccarpo@gmx.net]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2021
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import jsYaml from "js-yaml";
/**
 * YAML to JSON operation
 */
class YAMLToJSON extends Operation {

    /**
     * YAMLToJSON constructor
     */
    constructor() {
        super();

        this.name = "YAML 转换为 JSON";
        this.module = "Default";
        this.description = "将 YAML 转换为 JSON";
        this.infoURL = "https://en.wikipedia.org/wiki/YAML";
        this.inputType = "string";
        this.outputType = "JSON";
        this.args = [];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {JSON}
     */
    run(input, args) {
        try {
            return jsYaml.load(input);
        } catch (err) {
            throw new OperationError("无法解析 YAML: " + err);
        }
    }

}

export default YAMLToJSON;
