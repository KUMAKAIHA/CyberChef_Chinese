/**
 * Emulation of the Bombe machine.
 *
 * Tested against the Bombe Rebuild at Bletchley Park's TNMOC
 * using a variety of inputs and settings to confirm correctness.
 *
 * @author s2224834
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { isWorkerEnvironment } from "../Utils.mjs";
import { BombeMachine } from "../lib/Bombe.mjs";
import { ROTORS, ROTORS_FOURTH, REFLECTORS, Reflector } from "../lib/Enigma.mjs";

/**
 * Bombe operation
 */
class Bombe extends Operation {
    /**
     * Bombe constructor
     */
    constructor() {
        super();

        this.name = "Bombe";
        this.module = "Bletchley";
        this.description = "布莱切利园用于攻击 Enigma 密码机的 Bombe 机器的模拟，基于波兰和英国密码分析家的工作。<br><br>要运行此操作，你需要有一个“密文片段”（crib），即目标密文块的一些已知明文，并知道使用的转子。（如果你不知道转子，请参阅“Bombe (multiple runs)”操作。）该机器将建议 Enigma 的可能配置。每个建议都包含转子起始位置（从左到右）和已知的跳线板对。<br><br>选择密文片段：首先，请注意 Enigma 无法将字母加密为其自身，这使你可以排除一些可能的密文片段位置。其次，Bombe 不模拟 Enigma 的中间转子步进。你的密文片段越长，其中发生步进的可能性就越大，这将阻止攻击工作。但是，除此之外，较长的密文片段通常更好。该攻击产生一个“菜单”，该菜单将密文字母映射到明文，目标是产生“环路”：例如，对于密文 ABC 和密文片段 CAB，我们有映射 A&lt;-&gt;C、B&lt;-&gt;A 和 C&lt;-&gt;B，这产生一个环路 A-B-C-A。环路越多，密文片段越好。该操作将输出此内容：如果你的菜单环路太少或太短，通常会产生大量不正确的输出。尝试不同的密文片段。如果菜单看起来不错，但没有产生正确的答案，则你的密文片段可能不正确，或者你可能重叠了中间转子步进 - 请尝试不同的密文片段。<br><br>输出不足以完全解密数据。你必须通过检查来恢复其余的跳线板设置。并且没有考虑环位设置：这会影响中间转子何时步进。如果你的输出在一段时间内是正确的，然后出错，请同时调整右侧转子上的环和起始位置，直到输出改善。如有必要，对中间转子重复此操作。<br><br>默认情况下，此操作在每个停位上运行检查机，这是一个手动过程，用于验证 Bombe 停位的质量，并丢弃失败的停位。如果你想查看硬件对于给定输入实际停止了多少次，请禁用检查机。<br><br>有关 Enigma、Typex 和 Bombe 操作的更详细描述，<a href='https://github.com/gchq/CyberChef/wiki/Enigma,-the-Bombe,-and-Typex'>请点击此处</a>。";
        this.infoURL = "https://wikipedia.org/wiki/Bombe";
        this.inputType = "string";
        this.outputType = "JSON";
        this.presentType = "html";
        this.args = [
            {
                name: "模型",
                type: "argSelector",
                value: [
                    {
                        name: "3 转子",
                        off: [1]
                    },
                    {
                        name: "4 转子",
                        on: [1]
                    }
                ]
            },
            {
                name: "最左侧（第四）转子",
                type: "editableOption",
                value: ROTORS_FOURTH,
                defaultIndex: 0
            },
            {
                name: "左侧转子",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 0
            },
            {
                name: "中间转子",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 1
            },
            {
                name: "右侧转子",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 2
            },
            {
                name: "反射器",
                type: "editableOption",
                value: REFLECTORS
            },
            {
                name: "密文片段",
                type: "string",
                value: ""
            },
            {
                name: "密文片段偏移量",
                type: "number",
                value: 0
            },
            {
                name: "使用检查机",
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
    updateStatus(nLoops, nStops, progress) {
        const msg = `Bombe 运行，菜单中有 ${nLoops} 个环路（期望 2+）：${nStops} 个停位，完成 ${Math.floor(100 * progress)}%`;
        self.sendStatusMessage(msg);
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const model = args[0];
        const reflectorstr = args[5];
        let crib = args[6];
        const offset = args[7];
        const check = args[8];
        const rotors = [];
        for (let i=0; i<4; i++) {
            if (i === 0 && model === "3 转子") {
                // No fourth rotor
                continue;
            }
            let rstr = args[i + 1];
            // The Bombe doesn't take stepping into account so we'll just ignore it here
            if (rstr.includes("<")) {
                rstr = rstr.split("<", 2)[0];
            }
            rotors.push(rstr);
        }
        // Rotors are handled in reverse
        rotors.reverse();
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
        const reflector = new Reflector(reflectorstr);
        let update;
        if (isWorkerEnvironment()) {
            update = this.updateStatus;
        } else {
            update = undefined;
        }
        const bombe = new BombeMachine(rotors, reflector, ciphertext, crib, check, update);
        const result = bombe.run();
        return {
            nLoops: bombe.nLoops,
            result: result
        };
    }


    /**
     * Displays the Bombe results in an HTML table
     *
     * @param {Object} output
     * @param {number} output.nLoops
     * @param {Array[]} output.result
     * @returns {html}
     */
    present(output) {
        let html = `Bombe 在菜单上运行，环路数为 ${output.nLoops} 个${output.nLoops === 1 ? "" : "s"}（期望 2+）。注意：转子位置从左到右列出，从密文片段的开头开始，并忽略步进和环设置。确定了一些跳线板设置。还提供了从密文片段开头开始并忽略步进的解密预览。\n\n`;
        html += "<table class='table table-hover table-sm table-bordered table-nonfluid'><tr><th>转子停位</th>  <th>部分跳线板</th>  <th>解密预览</th></tr>\n";
        for (const [setting, stecker, decrypt] of output.result) {
            html += `<tr><td>${setting}</td>  <td>${stecker}</td>  <td>${decrypt}</td></tr>\n`;
        }
        html += "</table>";
        return html;
    }
}

export default Bombe;
