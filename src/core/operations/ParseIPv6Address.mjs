/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import OperationError from "../errors/OperationError.mjs";
import {strToIpv6, ipv6ToStr, ipv4ToStr, IPV6_REGEX} from "../lib/IP.mjs";
import BigNumber from "bignumber.js";

/**
 * Parse IPv6 address operation
 */
class ParseIPv6Address extends Operation {

    /**
     * ParseIPv6Address constructor
     */
    constructor() {
        super();

        this.name = "解析 IPv6 地址";
        this.module = "Default";
        this.description = "显示有效 IPv6 地址的长格式和短格式版本。<br><br>识别所有保留范围，并解析封装或隧道地址，包括 Teredo 和 6to4。";
        this.infoURL = "https://wikipedia.org/wiki/IPv6_address";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        let match,
            output = "";

        if ((match = IPV6_REGEX.exec(input))) {
            const ipv6 = strToIpv6(match[1]),
                longhand = ipv6ToStr(ipv6),
                shorthand = ipv6ToStr(ipv6, true);

            output += "长格式:  " + longhand + "\n短格式: " + shorthand + "\n";

            // Detect reserved addresses
            if (shorthand === "::") {
                // Unspecified address
                output += "\n\n未指定地址，对应 IPv4 中的 0.0.0.0/32。";
                output += "\n未指定地址范围: ::/128";
            } else if (shorthand === "::1") {
                // Loopback address
                output += "\n\n环回地址，指向本地主机，对应 IPv4 中的 127.0.0.1/8。";
                output += "\n环回地址范围: ::1/128";
            } else if (ipv6[0] === 0 && ipv6[1] === 0 && ipv6[2] === 0 &&
                ipv6[3] === 0 && ipv6[4] === 0 && ipv6[5] === 0xffff) {
                // IPv4-mapped IPv6 address
                output += "\n检测到 IPv4 映射 IPv6 地址。IPv6 客户端默认将以原生方式处理，而 IPv4 客户端将以其 IPv4 映射 IPv6 地址显示为 IPv6 客户端。";
                output += "\n映射的 IPv4 地址: " + ipv4ToStr((ipv6[6] << 16) + ipv6[7]);
                output += "\nIPv4 映射 IPv6 地址范围: ::ffff:0:0/96";
            } else if (ipv6[0] === 0 && ipv6[1] === 0 && ipv6[2] === 0 &&
                ipv6[3] === 0 && ipv6[4] === 0xffff && ipv6[5] === 0) {
                // IPv4-translated address
                output += "\n检测到 IPv4 转换地址。用于无状态 IP/ICMP 转换 (SIIT)。请参阅 RFC 6145 和 6052 了解更多详情。";
                output += "\n转换的 IPv4 地址: " + ipv4ToStr((ipv6[6] << 16) + ipv6[7]);
                output += "\nIPv4 转换地址范围: ::ffff:0:0:0/96";
            } else if (ipv6[0] === 0x100) {
                // Discard prefix per RFC 6666
                output += "\n检测到丢弃前缀。这在将流量转发到黑洞路由器以减轻拒绝服务攻击的影响时使用。请参阅 RFC 6666 了解更多详情。";
                output += "\n丢弃范围: 100::/64";
            } else if (ipv6[0] === 0x64 && ipv6[1] === 0xff9b && ipv6[2] === 0 &&
                ipv6[3] === 0 && ipv6[4] === 0 && ipv6[5] === 0) {
                // IPv4/IPv6 translation per RFC 6052
                output += "\n检测到 IPv4/IPv6 转换的“众所周知”前缀。请参阅 RFC 6052 了解更多详情。";
                output += "\n“众所周知”前缀范围: 64:ff9b::/96";
            } else if (ipv6[0] === 0x2001 && ipv6[1] === 0) {
                // Teredo tunneling
                output += "\n检测到 Teredo 隧道 IPv6 地址\n";
                const serverIpv4  = (ipv6[2] << 16) + ipv6[3],
                    udpPort     = (~ipv6[5]) & 0xffff,
                    clientIpv4  = ~((ipv6[6] << 16) + ipv6[7]),
                    flagCone    = (ipv6[4] >>> 15) & 1,
                    flagR       = (ipv6[4] >>> 14) & 1,
                    flagRandom1 = (ipv6[4] >>> 10) & 15,
                    flagUg      = (ipv6[4] >>> 8) & 3,
                    flagRandom2 = ipv6[4] & 255;

                output += "\n服务器 IPv4 地址: " + ipv4ToStr(serverIpv4) +
                    "\n客户端 IPv4 地址: " + ipv4ToStr(clientIpv4) +
                    "\n客户端 UDP 端口:     " + udpPort +
                    "\n标志:" +
                    "\n\t锥形 NAT:    " + flagCone;

                if (flagCone) {
                    output += " (客户端位于锥形 NAT 之后)";
                } else {
                    output += " (客户端不位于锥形 NAT 之后)";
                }

                output += "\n\tR:       " + flagR;

                if (flagR) {
                    output += " 错误：此标志应设置为 0。请参阅 RFC 5991 和 RFC 4380。";
                }

                output += "\n\t随机数 1: " + Utils.bin(flagRandom1, 4) +
                    "\n\tUG:      " + Utils.bin(flagUg, 2);

                if (flagUg) {
                    output += " 错误：此标志应设置为 00。请参阅 RFC 4380。";
                }

                output += "\n\t随机数 2: " + Utils.bin(flagRandom2, 8);

                if (!flagR && !flagUg && flagRandom1 && flagRandom2) {
                    output += "\n\n这是一个有效的 Teredo 地址，符合 RFC 4380 和 RFC 5991。";
                } else if (!flagR && !flagUg) {
                    output += "\n\n这是一个有效的 Teredo 地址，符合 RFC 4380，但不符合 RFC 5991（Teredo 安全更新），因为标志字段中没有随机位。";
                } else {
                    output += "\n\n这是一个无效的 Teredo 地址。";
                }
                output += "\n\nTeredo 前缀范围: 2001::/32";
            } else if (ipv6[0] === 0x2001 && ipv6[1] === 0x2 && ipv6[2] === 0) {
                // Benchmarking
                output += "\n分配给基准测试方法工作组 (BMWG) 用于 IPv6 基准测试。对应于 IPv4 基准测试的 198.18.0.0/15。请参阅 RFC 5180 了解更多详情。";
                output += "\nBMWG 范围: 2001:2::/48";
            } else if (ipv6[0] === 0x2001 && ipv6[1] >= 0x10 && ipv6[1] <= 0x1f) {
                // ORCHIDv1
                output += "\n已弃用，之前为 ORCHIDv1（Overlay Routable Cryptographic Hash Identifiers）。\nORCHIDv1 范围: 2001:10::/28\nORCHIDv2 现在使用 2001:20::/28。";
            } else if (ipv6[0] === 0x2001 && ipv6[1] >= 0x20 && ipv6[1] <= 0x2f) {
                // ORCHIDv2
                output += "\nORCHIDv2（Overlay Routable Cryptographic Hash Identifiers）。\n这些是非路由 IPv6 地址，用于加密哈希标识符。";
                output += "\nORCHIDv2 范围: 2001:20::/28";
            } else if (ipv6[0] === 0x2001 && ipv6[1] === 0xdb8) {
                // Documentation
                output += "\n这是一个文档 IPv6 地址。每当给出示例 IPv6 地址或建模网络场景时，都应使用此范围。对应于 IPv4 中的 192.0.2.0/24、198.51.100.0/24 和 203.0.113.0/24。";
                output += "\n文档范围: 2001:db8::/32";
            } else if (ipv6[0] === 0x2002) {
                // 6to4
                output += "\n检测到 6to4 过渡 IPv6 地址。请参阅 RFC 3056 了解更多详情。\n6to4 前缀范围: 2002::/16";

                const v4Addr = ipv4ToStr((ipv6[1] << 16) + ipv6[2]),
                    slaId = ipv6[3],
                    interfaceIdStr = ipv6[4].toString(16) + ipv6[5].toString(16) + ipv6[6].toString(16) + ipv6[7].toString(16),
                    interfaceId = new BigNumber(interfaceIdStr, 16);

                output += "\n\n封装的 IPv4 地址: " + v4Addr +
                    "\nSLA ID: " + slaId +
                    "\n接口 ID (base 16): " + interfaceIdStr +
                    "\n接口 ID (base 10): " + interfaceId.toString();
            } else if (ipv6[0] >= 0xfc00 && ipv6[0] <= 0xfdff) {
                // Unique local address
                output += "\n这是一个唯一的本地地址，类似于 IPv4 私有地址 10.0.0.0/8、172.16.0.0/12 和 192.168.0.0/16。请参阅 RFC 4193 了解更多详情。";
                output += "\n唯一本地地址范围: fc00::/7";
            } else if (ipv6[0] >= 0xfe80 && ipv6[0] <= 0xfebf) {
                // Link-local address
                output += "\n这是一个链路本地地址，类似于 IPv4 中的自动配置地址 169.254.0.0/16。";
                output += "\n链路本地地址范围: fe80::/10";
            } else if (ipv6[0] >= 0xff00) {
                // Multicast
                output += "\n这是一个保留的组播地址。";
                output += "\n组播地址范围: ff00::/8";

                switch (ipv6[0]) {
                    case 0xff01:
                        output += "\n\n接口本地范围的保留组播块";
                        break;
                    case 0xff02:
                        output += "\n\n链路本地范围的保留组播块";
                        break;
                    case 0xff03:
                        output += "\n\nRealm 本地范围的保留组播块";
                        break;
                    case 0xff04:
                        output += "\n\n管理本地范围的保留组播块";
                        break;
                    case 0xff05:
                        output += "\n\n站点本地范围的保留组播块";
                        break;
                    case 0xff08:
                        output += "\n\n组织本地范围的保留组播块";
                        break;
                    case 0xff0e:
                        output += "\n\n全局范围的保留组播块";
                        break;
                }

                if (ipv6[6] === 1) {
                    if (ipv6[7] === 2) {
                        output += "\n“所有 DHCP 服务器和中继代理（在 RFC3315 中定义）”的保留组播地址";
                    } else if (ipv6[7] === 3) {
                        output += "\n“所有 LLMNR 主机（在 RFC4795 中定义）”的保留组播地址";
                    }
                } else {
                    switch (ipv6[7]) {
                        case 1:
                            output += "\n“所有节点”的保留组播地址";
                            break;
                        case 2:
                            output += "\n“所有路由器”的保留组播地址";
                            break;
                        case 5:
                            output += "\n“OSPFv3 - 所有 OSPF 路由器”的保留组播地址";
                            break;
                        case 6:
                            output += "\n“OSPFv3 - 所有指定路由器”的保留组播地址";
                            break;
                        case 8:
                            output += "\n“IS-IS for IPv6 路由器”的保留组播地址";
                            break;
                        case 9:
                            output += "\n“RIP 路由器”的保留组播地址";
                            break;
                        case 0xa:
                            output += "\n“EIGRP 路由器”的保留组播地址";
                            break;
                        case 0xc:
                            output += "\n“简单服务发现协议”的保留组播地址";
                            break;
                        case 0xd:
                            output += "\n“PIM 路由器”的保留组播地址";
                            break;
                        case 0x16:
                            output += "\n“MLDv2 报告（在 RFC3810 中定义）”的保留组播地址";
                            break;
                        case 0x6b:
                            output += "\n“精确时间协议 v2 对等延迟测量消息”的保留组播地址";
                            break;
                        case 0xfb:
                            output += "\n“组播 DNS”的保留组播地址";
                            break;
                        case 0x101:
                            output += "\n“网络时间协议”的保留组播地址";
                            break;
                        case 0x108:
                            output += "\n“网络信息服务”的保留组播地址";
                            break;
                        case 0x114:
                            output += "\n“实验”的保留组播地址";
                            break;
                        case 0x181:
                            output += "\n“精确时间协议 v2 消息（不包括对等延迟）”的保留组播地址";
                            break;
                    }
                }
            }


            // Detect possible EUI-64 addresses
            if (((ipv6[5] & 0xff) === 0xff) && (ipv6[6] >>> 8 === 0xfe)) {
                output += "\n\n此 IPv6 地址包含一个修改后的 EUI-64 地址，通过第 12 和第 13 个八位字节中存在 FF:FE 来识别。";

                const intIdent = Utils.hex(ipv6[4] >>> 8) + ":" + Utils.hex(ipv6[4] & 0xff) + ":" +
                    Utils.hex(ipv6[5] >>> 8) + ":" + Utils.hex(ipv6[5] & 0xff) + ":" +
                    Utils.hex(ipv6[6] >>> 8) + ":" + Utils.hex(ipv6[6] & 0xff) + ":" +
                    Utils.hex(ipv6[7] >>> 8) + ":" + Utils.hex(ipv6[7] & 0xff),
                    mac = Utils.hex((ipv6[4] >>> 8) ^ 2) + ":" + Utils.hex(ipv6[4] & 0xff) + ":" +
                    Utils.hex(ipv6[5] >>> 8) + ":" + Utils.hex(ipv6[6] & 0xff) + ":" +
                    Utils.hex(ipv6[7] >>> 8) + ":" + Utils.hex(ipv6[7] & 0xff);
                output += "\n接口标识符: " + intIdent +
                    "\nMAC 地址:          " + mac;
            }
        } else {
            throw new OperationError("无效的 IPv6 地址");
        }
        return output;
    }

}

export default ParseIPv6Address;
