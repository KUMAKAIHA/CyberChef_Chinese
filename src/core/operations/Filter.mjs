/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import {INPUT_DELIM_OPTIONS} from "../lib/Delim.mjs";
import OperationError from "../errors/OperationError.mjs";
import XRegExp from "xregexp";

/**
 * Filter operation
 */
class Filter extends Operation {

    /**
     * Filter constructor
     */
    constructor() {
        super();

        this.name = "过滤";
        this.module = "Regex";
        this.description = "使用指定分隔符拆分输入，并基于正则表达式过滤每个分支。";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "分隔符",
                "type": "option",
                "value": INPUT_DELIM_OPTIONS
            },
            {
                "name": "Regex",
                "type": "string",
                "value": ""
            },
            {
                "name": "反转条件",
                "type": "boolean",
                "value": false
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const delim = Utils.charRep(args[0]),
            reverse = args[2];
        let regex;

        try {
            regex = new XRegExp(args[1]);
        } catch (err) {
            throw new OperationError(`Invalid regex. Details: ${err.message}`);
        }

        const regexFilter = function(value) {
            return reverse ^ regex.test(value);
        };

        return input.split(delim).filter(regexFilter).join(delim);
    }

}

export default Filter;
