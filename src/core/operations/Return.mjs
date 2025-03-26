/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Return operation
 */
class Return extends Operation {

    /**
     * Return constructor
     */
    constructor() {
        super();

        this.name = "返回";
        this.flowControl = true;
        this.module = "Default";
        this.description = "在此步骤位置结束操作执行。";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [];
    }

    /**
     * @param {Object} state - The current state of the recipe.
     * @param {number} state.progress - The current position in the recipe.
     * @param {Dish} state.dish - The Dish being operated on.
     * @param {Operation[]} state.opList - The list of operations in the recipe.
     * @returns {Object} The updated state of the recipe.
     */
    run(state) {
        state.progress = state.opList.length;
        return state;
    }

}

export default Return;
