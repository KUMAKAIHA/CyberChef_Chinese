/**
 * This script generates the exports functionality for the node API.
 *
 * it exports chef as default, but all the wrapped operations as
 * other top level exports.
 *
 * @author d98762656 [d98762625@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

/* eslint no-console: 0 */

import fs from "fs";
import path from "path";
import * as operations from "../../../core/operations/index.mjs";
import { decapitalise } from "../../apiUtils.mjs";
import excludedOperations from "../excludedOperations.mjs";

const includedOperations = Object.keys(operations).filter((op => excludedOperations.indexOf(op) === -1));

const dir = path.join(`${process.cwd()}/src/node`);
if (!fs.existsSync(dir)) {
    console.log("\nCWD: " + process.cwd());
    console.log("Error: generateNodeIndex.mjs should be run from the project root");
    console.log("Example> node --experimental-modules src/node/config/scripts/generateNodeIndex.mjs");
    process.exit(1);
}

let code = `/**
* THIS FILE IS AUTOMATICALLY GENERATED BY src/node/config/scripts/generateNodeIndex.mjs
*
* @author d98762625 [d98762625@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
* @copyright Crown Copyright 2019
* @license Apache-2.0
*/

/* eslint camelcase: 0 */


import NodeDish from "./NodeDish.mjs";
import { _wrap, help, bake, _explainExcludedFunction } from "./api.mjs";
import File from "./File.mjs";
import { OperationError, DishError, ExcludedOperationError } from "../core/errors/index.mjs";
import {
    // import as core_ to avoid name clashes after wrap.
`;

includedOperations.forEach((op) => {
    // prepend with core_ to avoid name collision later.
    code += `    ${op} as core_${op},\n`;
});

code +=`
} from "../core/operations/index.mjs";

global.File = File;

/**
 * generateChef
 *
 * Creates decapitalised, wrapped ops in chef object for default export.
 */
function generateChef() {
    return {
`;

includedOperations.forEach((op) => {
    code += `        "${decapitalise(op)}": _wrap(core_${op}),\n`;
});

excludedOperations.forEach((op) => {
    code += `        "${decapitalise(op)}": _explainExcludedFunction("${op}"),\n`;
});

code += `    };
}

const chef = generateChef();
// Add some additional features to chef object.
chef.help = help;
chef.Dish = NodeDish;

// Define consts here so we can add to top-level export - wont allow
// export of chef property.
`;

Object.keys(operations).forEach((op) => {
    code += `const ${decapitalise(op)} = chef.${decapitalise(op)};\n`;
});

code +=`

// Define array of all operations to create register for bake.
const operations = [\n`;

Object.keys(operations).forEach((op) => {
    code += `    ${decapitalise(op)},\n`;
});

code += `];

chef.bake = bake;
export default chef;

// Operations as top level exports.
export {
    operations,
`;

Object.keys(operations).forEach((op) => {
    code += `    ${decapitalise(op)},\n`;
});

code += "    NodeDish as Dish,\n";
code += "    bake,\n";
code += "    help,\n";
code += "    OperationError,\n";
code += "    ExcludedOperationError,\n";
code += "    DishError,\n";
code += "};\n";


fs.writeFileSync(
    path.join(dir, "./index.mjs"),
    code
);
