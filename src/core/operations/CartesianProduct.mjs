/**
 * @author d98762625 [d98762625@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Set cartesian product operation
 */
class CartesianProduct extends Operation {

    /**
     * Cartesian Product constructor
     */
    constructor() {
        super();

        this.name = "笛卡尔积";
        this.module = "Default";
        this.description = "计算多个数据集的笛卡尔积，返回所有可能的组合。";
        this.infoURL = "https://wikipedia.org/wiki/Cartesian_product";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "样本分隔符",
                type: "binaryString",
                value: "\\n\\n"
            },
            {
                name: "项目分隔符",
                type: "binaryString",
                value: ","
            },
        ];
    }

    /**
     * Validate input length
     *
     * @param {Object[]} sets
     * @throws {OperationError} if fewer than 2 sets
     */
    validateSampleNumbers(sets) {
        if (!sets || sets.length < 2) {
            throw new OperationError("数据集数量不正确，或许您需要修改样本分隔符或添加更多样本？");
        }
    }

    /**
     * Run the product operation
     *
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     * @throws {OperationError}
     */
    run(input, args) {
        [this.sampleDelim, this.itemDelimiter] = args;
        const sets = input.split(this.sampleDelim);

        this.validateSampleNumbers(sets);

        return this.runCartesianProduct(...sets.map(s => s.split(this.itemDelimiter)));
    }

    /**
    * Return the cartesian product of the two inputted sets.
    *
    * @param {Object[]} a
    * @param {Object[]} b
    * @param {Object[]} c
    * @returns {string}
    */
    runCartesianProduct(a, b, ...c) {
        /**
         * https://stackoverflow.com/a/43053803/7200497
         * @returns {Object[]}
         */
        const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
        /**
         * https://stackoverflow.com/a/43053803/7200497
         * @returns {Object[][]}
         */
        const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);

        return cartesian(a, b, ...c)
            .map(set => `(${set.join(",")})`)
            .join(this.itemDelimiter);
    }
}

export default CartesianProduct;
