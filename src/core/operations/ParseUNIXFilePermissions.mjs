/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Parse UNIX file permissions operation
 */
class ParseUNIXFilePermissions extends Operation {

    /**
     * ParseUNIXFilePermissions constructor
     */
    constructor() {
        super();

        this.name = "解析 UNIX 文件权限";
        this.module = "Default";
        this.description = "给定八进制或文本格式的 UNIX/Linux 文件权限字符串，此操作解释了哪些权限被授予给哪些用户组。<br><br>输入应为八进制（例如 <code>755</code>）或文本格式（例如 <code>drwxr-xr-x</code>）。";
        this.infoURL = "https://wikipedia.org/wiki/File_system_permissions#Traditional_Unix_permissions";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [];
        this.checks = [
            {
                pattern:  "^\\s*d[rxw-]{9}\\s*$",
                flags:  "",
                args:   []
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const perms = {
            d:  false, // directory
            sl: false, // symbolic link
            np: false, // named pipe
            s:  false, // socket
            cd: false, // character device
            bd: false, // block device
            dr: false, // door
            sb: false, // sticky bit
            su: false, // setuid
            sg: false, // setgid
            ru: false, // read user
            wu: false, // write user
            eu: false, // execute user
            rg: false, // read group
            wg: false, // write group
            eg: false, // execute group
            ro: false, // read other
            wo: false, // write other
            eo: false  // execute other
        };
        let d = 0,
            u = 0,
            g = 0,
            o = 0,
            output = "",
            octal = null,
            textual = null;

        if (input.search(/\s*[0-7]{1,4}\s*/i) === 0) {
            // Input is octal
            octal = input.match(/\s*([0-7]{1,4})\s*/i)[1];

            if (octal.length === 4) {
                d = parseInt(octal[0], 8);
                u = parseInt(octal[1], 8);
                g = parseInt(octal[2], 8);
                o = parseInt(octal[3], 8);
            } else {
                if (octal.length > 0) u = parseInt(octal[0], 8);
                if (octal.length > 1) g = parseInt(octal[1], 8);
                if (octal.length > 2) o = parseInt(octal[2], 8);
            }

            perms.su = d >> 2 & 0x1;
            perms.sg = d >> 1 & 0x1;
            perms.sb = d & 0x1;

            perms.ru = u >> 2 & 0x1;
            perms.wu = u >> 1 & 0x1;
            perms.eu = u & 0x1;

            perms.rg = g >> 2 & 0x1;
            perms.wg = g >> 1 & 0x1;
            perms.eg = g & 0x1;

            perms.ro = o >> 2 & 0x1;
            perms.wo = o >> 1 & 0x1;
            perms.eo = o & 0x1;
        } else if (input.search(/\s*[dlpcbDrwxsStT-]{1,10}\s*/) === 0) {
            // Input is textual
            textual = input.match(/\s*([dlpcbDrwxsStT-]{1,10})\s*/)[1];

            switch (textual[0]) {
                case "d":
                    perms.d = true;
                    break;
                case "l":
                    perms.sl = true;
                    break;
                case "p":
                    perms.np = true;
                    break;
                case "s":
                    perms.s = true;
                    break;
                case "c":
                    perms.cd = true;
                    break;
                case "b":
                    perms.bd = true;
                    break;
                case "D":
                    perms.dr = true;
                    break;
            }

            if (textual.length > 1) perms.ru = textual[1] === "r";
            if (textual.length > 2) perms.wu = textual[2] === "w";
            if (textual.length > 3) {
                switch (textual[3]) {
                    case "x":
                        perms.eu = true;
                        break;
                    case "s":
                        perms.eu = true;
                        perms.su = true;
                        break;
                    case "S":
                        perms.su = true;
                        break;
                }
            }

            if (textual.length > 4) perms.rg = textual[4] === "r";
            if (textual.length > 5) perms.wg = textual[5] === "w";
            if (textual.length > 6) {
                switch (textual[6]) {
                    case "x":
                        perms.eg = true;
                        break;
                    case "s":
                        perms.eg = true;
                        perms.sg = true;
                        break;
                    case "S":
                        perms.sg = true;
                        break;
                }
            }

            if (textual.length > 7) perms.ro = textual[7] === "r";
            if (textual.length > 8) perms.wo = textual[8] === "w";
            if (textual.length > 9) {
                switch (textual[9]) {
                    case "x":
                        perms.eo = true;
                        break;
                    case "t":
                        perms.eo = true;
                        perms.sb = true;
                        break;
                    case "T":
                        perms.sb = true;
                        break;
                }
            }
        } else {
            throw new OperationError("无效的输入格式。\n请输入八进制（例如 755）或文本格式（例如 drwxr-xr-x）的权限。");
        }

        output += "文本表示形式： " + permsToStr(perms);
        output += "\n八进制表示形式：   " + permsToOctal(perms);

        // File type
        if (textual) {
            output += "\n文件类型： " + ftFromPerms(perms);
        }

        // setuid, setgid
        if (perms.su) {
            output += "\n已设置 setuid 标志";
        }
        if (perms.sg) {
            output += "\n已设置 setgid 标志";
        }

        // sticky bit
        if (perms.sb) {
            output += "\n已设置粘滞位";
        }

        // Permission matrix
        output += `

 +---------+-------+-------+-------+
 |         | 用户  | 组    | 其他  |
 +---------+-------+-------+-------+
 |    读取 |   ${perms.ru ? "X" : " "}   |   ${perms.rg ? "X" : " "}   |   ${perms.ro ? "X" : " "}   |
 +---------+-------+-------+-------+
 |   写入 |   ${perms.wu ? "X" : " "}   |   ${perms.wg ? "X" : " "}   |   ${perms.wo ? "X" : " "}   |
 +---------+-------+-------+-------+
 | 执行  |   ${perms.eu ? "X" : " "}   |   ${perms.eg ? "X" : " "}   |   ${perms.eo ? "X" : " "}   |
 +---------+-------+-------+-------+`;

        return output;
    }

}


/**
 * Given a permissions object dictionary, generates a textual permissions string.
 *
 * @param {Object} perms
 * @returns {string}
 */
function permsToStr(perms) {
    let str = "",
        type = "-";

    if (perms.d) type = "d";
    if (perms.sl) type = "l";
    if (perms.np) type = "p";
    if (perms.s) type = "s";
    if (perms.cd) type = "c";
    if (perms.bd) type = "b";
    if (perms.dr) type = "D";

    str = type;

    str += perms.ru ? "r" : "-";
    str += perms.wu ? "w" : "-";
    if (perms.eu && perms.su) {
        str += "s";
    } else if (perms.su) {
        str += "S";
    } else if (perms.eu) {
        str += "x";
    } else {
        str += "-";
    }

    str += perms.rg ? "r" : "-";
    str += perms.wg ? "w" : "-";
    if (perms.eg && perms.sg) {
        str += "s";
    } else if (perms.sg) {
        str += "S";
    } else if (perms.eg) {
        str += "x";
    } else {
        str += "-";
    }

    str += perms.ro ? "r" : "-";
    str += perms.wo ? "w" : "-";
    if (perms.eo && perms.sb) {
        str += "t";
    } else if (perms.sb) {
        str += "T";
    } else if (perms.eo) {
        str += "x";
    } else {
        str += "-";
    }

    return str;
}

/**
 * Given a permissions object dictionary, generates an octal permissions string.
 *
 * @param {Object} perms
 * @returns {string}
 */
function permsToOctal(perms) {
    let d = 0,
        u = 0,
        g = 0,
        o = 0;

    if (perms.su) d += 4;
    if (perms.sg) d += 2;
    if (perms.sb) d += 1;

    if (perms.ru) u += 4;
    if (perms.wu) u += 2;
    if (perms.eu) u += 1;

    if (perms.rg) g += 4;
    if (perms.wg) g += 2;
    if (perms.eg) g += 1;

    if (perms.ro) o += 4;
    if (perms.wo) o += 2;
    if (perms.eo) o += 1;

    return d.toString() + u.toString() + g.toString() + o.toString();
}


/**
 * Given a permissions object dictionary, returns the file type.
 *
 * @param {Object} perms
 * @returns {string}
 */
function ftFromPerms(perms) {
    if (perms.d) return "目录";
    if (perms.sl) return "符号链接";
    if (perms.np) return "命名管道";
    if (perms.s) return "套接字";
    if (perms.cd) return "字符设备";
    if (perms.bd) return "块设备";
    if (perms.dr) return "门";
    return "普通文件";
}

export default ParseUNIXFilePermissions;
