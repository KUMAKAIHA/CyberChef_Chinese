/**
 * @author d98762625 [d98762625@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Set Intersection operation
 */
class SetIntersection extends Operation {

    /**
     * Set Intersection constructor
     */
    constructor() {
        super();

        this.name = "集合交集";
        this.module = "Default";
        this.description = "计算两个集合的交集。";
        this.infoURL = "https://wikipedia.org/wiki/Intersection_(set_theory)";
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
     * @throws {Error} if not two sets
     */
    validateSampleNumbers(sets) {
        if (!sets || (sets.length !== 2)) {
            throw new OperationError("Incorrect number of sets, perhaps you need to modify the sample delimiter or add more samples?");
        }
    }

    /**
     * Run the intersection operation
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

        return this.runIntersect(...sets.map(s => s.split(this.itemDelimiter)));
    }

    /**
     * Get the intersection of the two sets.
     *
     * @param {Object[]} a
     * @param {Object[]} b
     * @returns {Object[]}
     */
    runIntersect(a, b) {
        return a
            .filter((item) => {
                return b.indexOf(item) > -1;
            })
            .join(this.itemDelimiter);
    }

}

export default SetIntersection;
