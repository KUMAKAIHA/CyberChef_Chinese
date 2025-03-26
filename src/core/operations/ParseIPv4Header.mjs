/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import OperationError from "../errors/OperationError.mjs";
import {fromHex, toHex} from "../lib/Hex.mjs";
import {ipv4ToStr, protocolLookup} from "../lib/IP.mjs";
import TCPIPChecksum from "./TCPIPChecksum.mjs";

/**
 * Parse IPv4 header operation
 */
class ParseIPv4Header extends Operation {

    /**
     * ParseIPv4Header constructor
     */
    constructor() {
        super();

        this.name = "解析 IPv4 头部";
        this.module = "Default";
        this.description = "给定一个 IPv4 头部，此操作会解析并以易于阅读的格式显示每个字段。";
        this.infoURL = "https://wikipedia.org/wiki/IPv4#Header";
        this.inputType = "string";
        this.outputType = "html";
        this.args = [
            {
                "name": "输入格式",
                "type": "option",
                "value": ["Hex", "Raw"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {html}
     */
    run(input, args) {
        const format = args[0];
        let output;

        if (format === "Hex") {
            input = fromHex(input);
        } else if (format === "Raw") {
            input = new Uint8Array(Utils.strToArrayBuffer(input));
        } else {
            throw new OperationError("Unrecognised input format.");
        }

        let ihl = input[0] & 0x0f;
        const dscp = (input[1] >>> 2) & 0x3f,
            ecn = input[1] & 0x03,
            length = input[2] << 8 | input[3],
            identification = input[4] << 8 | input[5],
            flags = (input[6] >>> 5) & 0x07,
            fragOffset = (input[6] & 0x1f) << 8 | input[7],
            ttl = input[8],
            protocol = input[9],
            checksum = input[10] << 8 | input[11],
            srcIP = input[12] << 24 | input[13] << 16 | input[14] << 8 | input[15],
            dstIP = input[16] << 24 | input[17] << 16 | input[18] << 8 | input[19],
            checksumHeader = input.slice(0, 10).concat([0, 0]).concat(input.slice(12, 20));
        let version = (input[0] >>> 4) & 0x0f,
            options = [];


        // Version
        if (version !== 4) {
            version = version + " (Error: for IPv4 headers, this should always be set to 4)";
        }

        // IHL
        if (ihl < 5) {
            ihl = ihl + " (Error: this should always be at least 5)";
        } else if (ihl > 5) {
            // sort out options...
            const optionsLen = ihl * 4 - 20;
            options = input.slice(20, optionsLen + 20);
        }

        // Protocol
        const protocolInfo = protocolLookup[protocol] || {keyword: "", protocol: ""};

        // Checksum
        const correctChecksum = (new TCPIPChecksum).run(checksumHeader),
            givenChecksum = Utils.hex(checksum);
        let checksumResult;
        if (correctChecksum === givenChecksum) {
            checksumResult = givenChecksum + " (correct)";
        } else {
            checksumResult = givenChecksum + " (incorrect, should be " + correctChecksum + ")";
        }

        output = `<table class='table table-hover table-sm table-bordered table-nonfluid'><tr><th>字段</th><th>值</th></tr>
<tr><td>版本</td><td>${version}</td></tr>
<tr><td>互联网头部长度 (IHL)</td><td>${ihl} (${ihl * 4} 字节)</td></tr>
<tr><td>区分服务代码点 (DSCP)</td><td>${dscp}</td></tr>
<tr><td>显式拥塞通知 (ECN)</td><td>${ecn}</td></tr>
<tr><td>总长度</td><td>${length} 字节
  IP 头部: ${ihl * 4} 字节
  数据: ${length - ihl * 4} 字节</td></tr>
<tr><td>标识</td><td>0x${Utils.hex(identification)} (${identification})</td></tr>
<tr><td>标志</td><td>0x${Utils.hex(flags, 2)}
  保留位:${flags >> 2} (必须为 0)
  禁止分片:${flags >> 1 & 1}
  更多分片:${flags & 1}</td></tr>
<tr><td>分片偏移</td><td>${fragOffset}</td></tr>
<tr><td>生存时间</td><td>${ttl}</td></tr>
<tr><td>协议</td><td>${protocol}, ${protocolInfo.protocol} (${protocolInfo.keyword})</td></tr>
<tr><td>头部校验和</td><td>${checksumResult}</td></tr>
<tr><td>源 IP 地址</td><td>${ipv4ToStr(srcIP)}</td></tr>
<tr><td>目标 IP 地址</td><td>${ipv4ToStr(dstIP)}</td></tr>`;

        if (ihl > 5) {
            output += `<tr><td>选项</td><td>${toHex(options)}</td></tr>`;
        }

        return output + "</table>";
    }

}

export default ParseIPv4Header;
