/**
 * @author tlwr [toby@toby.codes]
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * HTTP request operation
 */
class HTTPRequest extends Operation {

    /**
     * HTTPRequest constructor
     */
    constructor() {
        super();

        this.name = "HTTP 请求";
        this.module = "Default";
        this.description = [
            "发起 HTTP 请求并返回响应。",
            "<br><br>",
            "此操作支持不同的 HTTP 方法，例如 GET、POST、PUT 等。",
            "<br><br>",
            "您可以逐行添加请求头，格式为 <code>键: 值</code>",
            "<br><br>",
            "可以通过勾选“显示响应元数据”选项查看响应的状态代码以及部分公开的标头。出于安全原因，浏览器仅公开有限的响应标头。",
        ].join("\n");
        this.infoURL = "https://wikipedia.org/wiki/List_of_HTTP_header_fields#Request_fields";
        this.inputType = "string";
        this.outputType = "string";
        this.manualBake = true;
        this.args = [
            {
                "name": "方法",
                "type": "option",
                "value": [
                    "GET", "POST", "HEAD",
                    "PUT", "PATCH", "DELETE",
                    "CONNECT", "TRACE", "OPTIONS"
                ]
            },
            {
                "name": "URL",
                "type": "string",
                "value": ""
            },
            {
                "name": "请求头",
                "type": "text",
                "value": ""
            },
            {
                "name": "模式",
                "type": "option",
                "value": [
                    "跨域资源共享 (CORS)",
                    "无 CORS (仅限 HEAD, GET 或 POST)",
                ]
            },
            {
                "name": "显示响应元数据",
                "type": "boolean",
                "value": false
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [method, url, headersText, mode, showResponseMetadata] = args;

        if (url.length === 0) return "";

        const headers = new Headers();
        headersText.split(/\r?\n/).forEach(line => {
            line = line.trim();

            if (line.length === 0) return;

            const split = line.split(":");
            if (split.length !== 2) throw `Could not parse header in line: ${line}`;

            headers.set(split[0].trim(), split[1].trim());
        });

        const config = {
            method: method,
            headers: headers,
            mode: modeLookup[mode],
            cache: "no-cache",
        };

        if (method !== "GET" && method !== "HEAD") {
            config.body = input;
        }

        return fetch(url, config)
            .then(r => {
                if (r.status === 0 && r.type === "opaque") {
                    throw new OperationError("错误：空响应。请尝试将连接模式设置为 CORS。");
                }

                if (showResponseMetadata) {
                    let headers = "";
                    for (const pair of r.headers.entries()) {
                        headers += "    " + pair[0] + ": " + pair[1] + "\n";
                    }
                    return r.text().then(b => {
                        return "####\n  状态： " + r.status + " " + r.statusText +
                            "\n  公开的标头:\n" + headers + "####\n\n" + b;
                    });
                }
                return r.text();
            })
            .catch(e => {
                throw new OperationError(e.toString() +
                    "\n\n此错误可能是由以下原因之一造成的：\n" +
                    " - 无效的 URL\n" +
                    " - 从安全来源 (HTTPS) 请求不安全资源 (HTTP)\n" +
                    " - 向不支持 CORS 的服务器发起跨域请求\n");
            });
    }

}


/**
 * Lookup table for HTTP modes
 *
 * @private
 */
const modeLookup = {
    "跨域资源共享 (CORS)": "cors",
    "无 CORS (仅限 HEAD, GET 或 POST)": "no-cors",
};


export default HTTPRequest;
