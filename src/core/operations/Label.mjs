/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Label operation. For use with Jump and Conditional Jump.
 */
class Label extends Operation {

    /**
     * Label constructor
     */
    constructor() {
        super();

        this.name = "标签";
        this.flowControl = true;
        this.module = "Default";
        this.description = "为条件跳转和固定跳转提供重定向执行的位置。";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "名称",
                "type": "shortString",
                "value": ""
            }
        ];
    }

    /**
     * @param {Object} state - The current state of the recipe.
     * @param {number} state.progress - The current position in the recipe.
     * @param {Dish} state.dish - The Dish being operated on.
     * @param {Operation[]} state.opList - The list of operations in the recipe.
     * @returns {Object} The updated state of the recipe.
     */
    run(state) {
        return state;
    }

}

export default Label;
