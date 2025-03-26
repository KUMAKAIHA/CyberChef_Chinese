/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Merge operation
 */
class Merge extends Operation {

    /**
     * Merge constructor
     */
    constructor() {
        super();

        this.name = "合并";
        this.flowControl = true;
        this.module = "Default";
        this.description = "将所有分支合并回主干。与 Fork 操作相反。取消选中“全部合并”复选框将仅合并所有分支到最近的 Fork/Subsection 操作。";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "全部合并",
                type: "boolean",
                value: true,
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
        // No need to actually do anything here. The fork operation will
        // merge when it sees this operation.
        return state;
    }

}

export default Merge;
