/**
 * @author joostrijneveld [joost@joostrijneveld.nl]
 * @copyright Crown Copyright 2022
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Utils from "../Utils.mjs";
import { toHex } from "../lib/Hex.mjs";

/**
 * Computes the ChaCha block function
 *
 * @param {byteArray} key
 * @param {byteArray} nonce
 * @param {byteArray} counter
 * @param {integer} rounds
 * @returns {byteArray}
 */
function chacha(key, nonce, counter, rounds) {
    const tau = "expand 16-byte k";
    const sigma = "expand 32-byte k";

    let state, c;
    if (key.length === 16) {
        c = Utils.strToByteArray(tau);
        state = c.concat(key).concat(key);
    } else {
        c = Utils.strToByteArray(sigma);
        state = c.concat(key);
    }
    state = state.concat(counter).concat(nonce);

    const x = Array();
    for (let i = 0; i < 64; i += 4) {
        x.push(Utils.byteArrayToInt(state.slice(i, i + 4), "little"));
    }
    const a = [...x];

    /**
     * Macro to compute a 32-bit rotate-left operation
     *
     * @param {integer} x
     * @param {integer} n
     * @returns {integer}
     */
    function ROL32(x, n) {
        return ((x << n) & 0xFFFFFFFF) | (x >>> (32 - n));
    }

    /**
     * Macro to compute a single ChaCha quarterround operation
     *
     * @param {integer} x
     * @param {integer} a
     * @param {integer} b
     * @param {integer} c
     * @param {integer} d
     * @returns {integer}
     */
    function quarterround(x, a, b, c, d) {
        x[a] = ((x[a] + x[b]) & 0xFFFFFFFF); x[d] = ROL32(x[d] ^ x[a], 16);
        x[c] = ((x[c] + x[d]) & 0xFFFFFFFF); x[b] = ROL32(x[b] ^ x[c], 12);
        x[a] = ((x[a] + x[b]) & 0xFFFFFFFF); x[d] = ROL32(x[d] ^ x[a], 8);
        x[c] = ((x[c] + x[d]) & 0xFFFFFFFF); x[b] = ROL32(x[b] ^ x[c], 7);
    }

    for (let i = 0; i < rounds / 2; i++)  {
        quarterround(x, 0, 4,  8, 12);
        quarterround(x, 1, 5,  9, 13);
        quarterround(x, 2, 6, 10, 14);
        quarterround(x, 3, 7, 11, 15);
        quarterround(x, 0, 5, 10, 15);
        quarterround(x, 1, 6, 11, 12);
        quarterround(x, 2, 7,  8, 13);
        quarterround(x, 3, 4,  9, 14);
    }

    for (let i = 0; i < 16; i++) {
        x[i] = (x[i] + a[i]) & 0xFFFFFFFF;
    }

    let output = Array();
    for (let i = 0; i < 16; i++) {
        output = output.concat(Utils.intToByteArray(x[i], 4, "little"));
    }
    return output;
}

/**
 * ChaCha operation
 */
class ChaCha extends Operation {

    /**
     * ChaCha constructor
     */
    constructor() {
        super();

        this.name = "ChaCha";
        this.module = "Ciphers";
        this.description = "ChaCha 是由 Daniel J. Bernstein 设计的一种流密码。它是 Salsa 流密码的变体。存在几种参数化方案；“ChaCha”可能指原始构造，或 RFC-8439 中描述的变体。ChaCha 通常与 Poly1305 一起使用，在 ChaCha20-Poly1305 AEAD 构造中。<br><br><b>密钥 (Key):</b> ChaCha 使用 16 或 32 字节（128 或 256 位）的密钥。<br><br><b>Nonce:</b> ChaCha 使用 8 或 12 字节（64 或 96 位）的 Nonce。<br><br><b>计数器 (Counter):</b> ChaCha 使用 4 或 8 字节（32 或 64 位）的计数器；Nonce 和计数器加起来必须为 16 字节。计数器在密钥流开始时从零开始，并且每 64 字节递增。";
        this.infoURL = "https://wikipedia.org/wiki/Salsa20#ChaCha_variant";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "密钥",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                "name": "Nonce",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64", "Integer"]
            },
            {
                "name": "计数器",
                "type": "number",
                "value": 0,
                "min": 0
            },
            {
                "name": "轮数",
                "type": "option",
                "value": ["20", "12", "8"]
            },
            {
                "name": "输入",
                "type": "option",
                "value": ["Hex", "Raw"]
            },
            {
                "name": "输出",
                "type": "option",
                "value": ["Raw", "Hex"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const key = Utils.convertToByteArray(args[0].string, args[0].option),
            nonceType = args[1].option,
            rounds = parseInt(args[3], 10),
            inputType = args[4],
            outputType = args[5];

        if (key.length !== 16 && key.length !== 32) {
            throw new OperationError(`无效的密钥长度：${key.length} 字节。\n\nChaCha 使用 16 或 32 字节（128 或 256 位）的密钥。`);
        }

        let counter, nonce, counterLength;
        if (nonceType === "Integer") {
            nonce = Utils.intToByteArray(parseInt(args[1].string, 10), 12, "little");
            counterLength = 4;
        } else {
            nonce = Utils.convertToByteArray(args[1].string, args[1].option);
            if (!(nonce.length === 12 || nonce.length === 8)) {
                throw new OperationError(`无效的 Nonce 长度：${nonce.length} 字节。\n\nChaCha 使用 8 或 12 字节（64 或 96 位）的 Nonce。`);
            }
            counterLength = 16 - nonce.length;
        }
        counter = Utils.intToByteArray(args[2], counterLength, "little");

        const output = [];
        input = Utils.convertToByteArray(input, inputType);

        let counterAsInt = Utils.byteArrayToInt(counter, "little");
        for (let i = 0; i < input.length; i += 64) {
            counter = Utils.intToByteArray(counterAsInt, counterLength, "little");
            const stream = chacha(key, nonce, counter, rounds);
            for (let j = 0; j < 64 && i + j < input.length; j++) {
                output.push(input[i + j] ^ stream[j]);
            }
            counterAsInt++;
        }

        if (outputType === "Hex") {
            return toHex(output);
        } else {
            return Utils.arrayBufferToStr(Uint8Array.from(output).buffer);
        }
    }

    /**
     * Highlight ChaCha
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlight(pos, args) {
        const inputType = args[4],
            outputType = args[5];
        if (inputType === "Raw" && outputType === "Raw") {
            return pos;
        }
    }

    /**
     * Highlight ChaCha in reverse
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlightReverse(pos, args) {
        const inputType = args[4],
            outputType = args[5];
        if (inputType === "Raw" && outputType === "Raw") {
            return pos;
        }
    }

}

export default ChaCha;
