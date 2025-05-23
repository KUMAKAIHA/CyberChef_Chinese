/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import { getLabelIndex } from "../lib/FlowControl.mjs";

/**
 * Jump operation
 */
class Jump extends Operation {

    /**
     * Jump constructor
     */
    constructor() {
        super();

        this.name = "跳转";
        this.flowControl = true;
        this.module = "Default";
        this.description = "向前或向后跳转到指定的标签";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "标签名称",
                "type": "string",
                "value": ""
            },
            {
                "name": "最大跳转次数 (如果向后跳转)",
                "type": "number",
                "value": 10
            }
        ];
    }

    /**
     * @param {Object} state - The current state of the recipe.
     * @param {number} state.progress - The current position in the recipe.
     * @param {Dish} state.dish - The Dish being operated on.
     * @param {Operation[]} state.opList - The list of operations in the recipe.
     * @param {number} state.numJumps - The number of jumps taken so far.
     * @returns {Object} The updated state of the recipe.
     */
    run(state) {
        const ings = state.opList[state.progress].ingValues;
        const [label, maxJumps] = ings;
        const jmpIndex = getLabelIndex(label, state);

        if (state.numJumps >= maxJumps || jmpIndex === -1) {
            state.numJumps = 0;
            return state;
        }

        state.progress = jmpIndex;
        state.numJumps++;
        return state;
    }

}

export default Jump;
