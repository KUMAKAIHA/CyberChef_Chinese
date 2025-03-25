/**
 * @author h345983745
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */
import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * DNS over HTTPS operation
 */
class DNSOverHTTPS extends Operation {

    /**
     * DNSOverHTTPS constructor
     */
    constructor() {
        super();

        this.name = "基于 HTTPS 的 DNS";
        this.module = "Default";
        this.description = [
            "接受单个域名，并使用基于 HTTPS 的 DNS 执行 DNS 查询。",
            "<br><br>",
            "默认情况下，支持 <a href='https://developers.cloudflare.com/1.1.1.1/dns-over-https/'>Cloudflare</a> 和 <a href='https://developers.google.com/speed/public-dns/docs/dns-over-https'>Google</a> 的基于 HTTPS 的 DNS 服务。",
            "<br><br>",
            "可以与任何支持 GET 参数 <code>name</code> 和 <code>type</code> 的服务一起使用。"
        ].join("\n");
        this.infoURL = "https://wikipedia.org/wiki/DNS_over_HTTPS";
        this.inputType = "string";
        this.outputType = "JSON";
        this.manualBake = true;
        this.args = [
            {
                name: "解析器",
                type: "editableOption",
                value: [
                    {
                        name: "谷歌",
                        value: "https://dns.google.com/resolve"
                    },
                    {
                        name: "Cloudflare",
                        value: "https://cloudflare-dns.com/dns-query"
                    }
                ]
            },
            {
                name: "请求类型",
                type: "option",
                value: [
                    "A",
                    "AAAA",
                    "ANAME",
                    "CERT",
                    "CNAME",
                    "DNSKEY",
                    "HTTPS",
                    "IPSECKEY",
                    "LOC",
                    "MX",
                    "NS",
                    "OPENPGPKEY",
                    "PTR",
                    "RRSIG",
                    "SIG",
                    "SOA",
                    "SPF",
                    "SRV",
                    "SSHFP",
                    "TA",
                    "TXT",
                    "URI",
                    "ANY"
                ]
            },
            {
                name: "仅返回 Answer 数据",
                type: "boolean",
                value: false
            },
            {
                name: "禁用 DNSSEC 验证",
                type: "boolean",
                value: false
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {JSON}
     */
    run(input, args) {
        const [resolver, requestType, justAnswer, DNSSEC] = args;
        let url = URL;
        try {
            url = new URL(resolver);
        } catch (error) {
            throw new OperationError(error.toString() +
            "\n\n此错误可能是由以下原因之一造成的：\n - 无效的解析器 URL\n");
        }
        const params = {name: input, type: requestType, cd: DNSSEC};

        url.search = new URLSearchParams(params);

        return fetch(url, {headers: {"accept": "application/dns-json"}}).then(response => {
            return response.json();
        }).then(data => {
            if (justAnswer) {
                return extractData(data.Answer);
            }
            return data;
        }).catch(e => {
            throw new OperationError(`请求 ${url} 时出错\n${e.toString()}`);
        });

    }
}

/**
 * Construct an array of just data from a DNS Answer section
 *
 * @private
 * @param {JSON} data
 * @returns {JSON}
 */
function extractData(data) {
    if (typeof(data) == "undefined") {
        return [];
    } else {
        const dataValues = [];
        data.forEach(element => {
            dataValues.push(element.data);
        });
        return dataValues;
    }
}

export default DNSOverHTTPS;
