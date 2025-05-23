/**
 * @author d98762625 [d98762625@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Utils from "../Utils.mjs";
import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Set Symmetric Difference operation
 */
class SymmetricDifference extends Operation {

    /**
     * Symmetric Difference constructor
     */
    constructor() {
        super();

        this.name = "对称差集";
        this.module = "Default";
        this.description = "计算两个集合的对称差集。";
        this.infoURL = "https://wikipedia.org/wiki/Symmetric_difference";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "样本分隔符",
                type: "binaryString",
                value: Utils.escapeHtml("\\n\\n")
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
     * @throws {Error} if not two sets
     */
    validateSampleNumbers(sets) {
        if (!sets || (sets.length !== 2)) {
            throw new OperationError("集合数量不正确，或许你需要修改样本分隔符或添加更多样本？");
        }
    }

    /**
     * Run the difference operation
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

        return this.runSymmetricDifference(...sets.map(s => s.split(this.itemDelimiter)));
    }

    /**
     * Get elements in set a that are not in set b
     *
     * @param {Object[]} a
     * @param {Object[]} b
     * @returns {Object[]}
     */
    runSetDifference(a, b) {
        return a.filter((item) => {
            return b.indexOf(item) === -1;
        });
    }

    /**
     * Get elements of each set that aren't in the other set.
     *
     * @param {Object[]} a
     * @param {Object[]} b
     * @return {Object[]}
     */
    runSymmetricDifference(a, b) {
        return this.runSetDifference(a, b)
            .concat(this.runSetDifference(b, a))
            .join(this.itemDelimiter);
    }

}

export default SymmetricDifference;
