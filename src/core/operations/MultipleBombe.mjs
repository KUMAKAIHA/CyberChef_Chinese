/**
 * Emulation of the Bombe machine.
 * This version carries out multiple Bombe runs to handle unknown rotor configurations.
 *
 * @author s2224834
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { BombeMachine } from "../lib/Bombe.mjs";
import { ROTORS, ROTORS_FOURTH, REFLECTORS, Reflector } from "../lib/Enigma.mjs";
import { isWorkerEnvironment } from "../Utils.mjs";


/**
 * Convenience method for flattening the preset ROTORS object into a newline-separated string.
 * @param {Object[]} - Preset rotors object
 * @param {number} s - Start index
 * @param {number} n - End index
 * @returns {string}
 */
function rotorsFormat(rotors, s, n) {
    const res = [];
    for (const i of rotors.slice(s, n)) {
        res.push(i.value);
    }
    return res.join("\n");
}

/**
 * Combinatorics choose function
 * @param {number} n
 * @param {number} k
 * @returns number
 */
function choose(n, k) {
    let res = 1;
    for (let i=1; i<=k; i++) {
        res *= (n + 1 - i) / i;
    }
    return res;
}

/**
 * Bombe operation
 */
class MultipleBombe extends Operation {
    /**
     * Bombe constructor
     */
    constructor() {
        super();

        this.name = "多次 Bombe";
        this.module = "Bletchley";
        this.description = "模拟用于攻击 Enigma 密码机的 Bombe 机器。此版本执行多次 Bombe 运算以处理未知的转子配置。<br><br>在在此处运行之前，您应该在单个 Bombe 操作上测试您的菜单。有关选择 crib 的说明，请参阅 Bombe 操作的描述。<br><br>有关 Enigma、Typex 和 Bombe 操作的更详细描述，请<a href='https://github.com/gchq/CyberChef/wiki/Enigma,-the-Bombe,-and-Typex'>点击此处查看</a>。";
        this.infoURL = "https://wikipedia.org/wiki/Bombe";
        this.inputType = "string";
        this.outputType = "JSON";
        this.presentType = "html";
        this.args = [
            {
                "name": "标准 Enigma 密码机",
                "type": "populateMultiOption",
                "value": [
                    {
                        name: "德军制式 Enigma 密码机 (第一版 - 3 转子)",
                        value: [
                            rotorsFormat(ROTORS, 0, 5),
                            "",
                            rotorsFormat(REFLECTORS, 0, 1)
                        ]
                    },
                    {
                        name: "德军制式 Enigma 密码机 (第二版 - 3 转子)",
                        value: [
                            rotorsFormat(ROTORS, 0, 8),
                            "",
                            rotorsFormat(REFLECTORS, 0, 2)
                        ]
                    },
                    {
                        name: "德军制式 Enigma 密码机 (第三版 - 4 转子)",
                        value: [
                            rotorsFormat(ROTORS, 0, 8),
                            rotorsFormat(ROTORS_FOURTH, 1, 2),
                            rotorsFormat(REFLECTORS, 2, 3)
                        ]
                    },
                    {
                        name: "德军制式 Enigma 密码机 (第四版 - 4 转子)",
                        value: [
                            rotorsFormat(ROTORS, 0, 8),
                            rotorsFormat(ROTORS_FOURTH, 1, 3),
                            rotorsFormat(REFLECTORS, 2, 4)
                        ]
                    },
                    {
                        name: "用户自定义",
                        value: ["", "", ""]
                    },
                ],
                "target": [1, 2, 3]
            },
            {
                name: "主转子",
                type: "text",
                value: ""
            },
            {
                name: "第四转子",
                type: "text",
                value: ""
            },
            {
                name: "反射器",
                type: "text",
                value: ""
            },
            {
                name: "字谜短句 (Crib)",
                type: "string",
                value: ""
            },
            {
                name: "字谜短句偏移量 (Crib 偏移量)",
                type: "number",
                value: 0
            },
            {
                name: "使用校验机",
                type: "boolean",
                value: true
            }
        ];
    }

    /**
     * Format and send a status update message.
     * @param {number} nLoops - Number of loops in the menu
     * @param {number} nStops - How many stops so far
     * @param {number} progress - Progress (as a float in the range 0..1)
     */
    updateStatus(nLoops, nStops, progress, start) {
        const elapsed = Date.now() - start;
        const remaining = (elapsed / progress) * (1 - progress) / 1000;
        const hours = Math.floor(remaining / 3600);
        const minutes = `0${Math.floor((remaining % 3600) / 60)}`.slice(-2);
        const seconds = `0${Math.floor(remaining % 60)}`.slice(-2);
        const msg = `Bombe run with ${nLoops} loop${nLoops === 1 ? "" : "s"} in menu (2+ desirable): ${nStops} stops, ${Math.floor(100 * progress)}% done, ${hours}:${minutes}:${seconds} remaining`;
        self.sendStatusMessage(msg);
    }

    /**
     * Early rotor description string validation.
     * Drops stepping information.
     * @param {string} rstr - The rotor description string
     * @returns {string} - Rotor description with stepping stripped, if any
     */
    validateRotor(rstr) {
        // The Bombe doesn't take stepping into account so we'll just ignore it here
        if (rstr.includes("<")) {
            rstr = rstr.split("<", 2)[0];
        }
        // Duplicate the validation of the rotor strings here, otherwise you might get an error
        // thrown halfway into a big Bombe run
        if (!/^[A-Z]{26}$/.test(rstr)) {
            throw new OperationError("Rotor wiring must be 26 unique uppercase letters");
        }
        if (new Set(rstr).size !== 26) {
            throw new OperationError("Rotor wiring must be 26 unique uppercase letters");
        }
        return rstr;
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const mainRotorsStr = args[1];
        const fourthRotorsStr = args[2];
        const reflectorsStr = args[3];
        let crib = args[4];
        const offset = args[5];
        const check = args[6];
        const rotors = [];
        const fourthRotors = [];
        const reflectors = [];
        for (let rstr of mainRotorsStr.split("\n")) {
            rstr = this.validateRotor(rstr);
            rotors.push(rstr);
        }
        if (rotors.length < 3) {
            throw new OperationError("A minimum of three rotors must be supplied");
        }
        if (fourthRotorsStr !== "") {
            for (let rstr of fourthRotorsStr.split("\n")) {
                rstr = this.validateRotor(rstr);
                fourthRotors.push(rstr);
            }
        }
        if (fourthRotors.length === 0) {
            fourthRotors.push("");
        }
        for (const rstr of reflectorsStr.split("\n")) {
            const reflector = new Reflector(rstr);
            reflectors.push(reflector);
        }
        if (reflectors.length === 0) {
            throw new OperationError("A minimum of one reflector must be supplied");
        }
        if (crib.length === 0) {
            throw new OperationError("Crib cannot be empty");
        }
        if (offset < 0) {
            throw new OperationError("Offset cannot be negative");
        }
        // For symmetry with the Enigma op, for the input we'll just remove all invalid characters
        input = input.replace(/[^A-Za-z]/g, "").toUpperCase();
        crib = crib.replace(/[^A-Za-z]/g, "").toUpperCase();
        const ciphertext = input.slice(offset);
        let update;
        if (isWorkerEnvironment()) {
            update = this.updateStatus;
        } else {
            update = undefined;
        }
        let bombe = undefined;
        const output = {bombeRuns: []};
        // I could use a proper combinatorics algorithm here... but it would be more code to
        // write one, and we don't seem to have one in our existing libraries, so massively nested
        // for loop it is
        const totalRuns = choose(rotors.length, 3) * 6 * fourthRotors.length * reflectors.length;
        let nRuns = 0;
        let nStops = 0;
        const start = Date.now();
        for (const rotor1 of rotors) {
            for (const rotor2 of rotors) {
                if (rotor2 === rotor1) {
                    continue;
                }
                for (const rotor3 of rotors) {
                    if (rotor3 === rotor2 || rotor3 === rotor1) {
                        continue;
                    }
                    for (const rotor4 of fourthRotors) {
                        for (const reflector of reflectors) {
                            nRuns++;
                            const runRotors = [rotor1, rotor2, rotor3];
                            if (rotor4 !== "") {
                                runRotors.push(rotor4);
                            }
                            if (bombe === undefined) {
                                bombe = new BombeMachine(runRotors, reflector, ciphertext, crib, check);
                                output.nLoops = bombe.nLoops;
                            } else {
                                bombe.changeRotors(runRotors, reflector);
                            }
                            const result = bombe.run();
                            nStops += result.length;
                            if (update !== undefined) {
                                update(bombe.nLoops, nStops, nRuns / totalRuns, start);
                            }
                            if (result.length > 0) {
                                output.bombeRuns.push({
                                    rotors: runRotors,
                                    reflector: reflector.pairs,
                                    result: result
                                });
                            }
                        }
                    }
                }
            }
        }
        return output;
    }


    /**
     * Displays the MultiBombe results in an HTML table
     *
     * @param {Object} output
     * @param {number} output.nLoops
     * @param {Array[]} output.result
     * @returns {html}
     */
    present(output) {
        let html = `Bombe 运行菜单包含 ${output.nLoops} 循环${output.nLoops === 1 ? "" : "s"} (建议值 2 或更多)。注意：转子和转子位置从左到右列出，忽略步进和环设置，位置从字谜短句的开头算起。已确定部分插线板设置。还提供了从字谜短句开头开始且忽略步进的解密预览。\n`;

        for (const run of output.bombeRuns) {
            html += `\n转子：${run.rotors.slice().reverse().join(", ")}\n反射器：${run.reflector}\n`;
            html += "<table class='table table-hover table-sm table-bordered table-nonfluid'><tr><th>转子停位</th>  <th>部分插线板</th>  <th>解密预览</th></tr>\n";
            for (const [setting, stecker, decrypt] of run.result) {
                html += `<tr><td>${setting}</td>  <td>${stecker}</td>  <td>${decrypt}</td></tr>\n`;
            }
            html += "</table>\n";
        }
        return html;
    }
}

export default MultipleBombe;
