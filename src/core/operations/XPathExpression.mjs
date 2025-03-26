/**
 * @author Mikescher (https://github.com/Mikescher | https://mikescher.com)
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import xmldom from "@xmldom/xmldom";
import xpath from "xpath";

/**
 * XPath expression operation
 */
class XPathExpression extends Operation {

    /**
     * XPathExpression constructor
     */
    constructor() {
        super();

        this.name = "XPath 表达式";
        this.module = "Code";
        this.description = "使用 XPath 查询从 XML 文档中提取信息";
        this.infoURL = "https://wikipedia.org/wiki/XPath";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "XPath",
                "type": "string",
                "value": ""
            },
            {
                "name": "结果分隔符",
                "type": "binaryShortString",
                "value": "\\n"
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [query, delimiter] = args;

        let doc;
        try {
            doc = new xmldom.DOMParser({
                errorHandler: {
                    fatalError(e) {
                        throw e;
                    }
                }
            }).parseFromString(input, "application/xml");
        } catch (err) {
            throw new OperationError("无效的输入 XML。");
        }

        let nodes;
        try {
            nodes = xpath.parse(query).select({ node: doc, allowAnyNamespaceForNoPrefix: true });
        } catch (err) {
            throw new OperationError(`无效的 XPath。详情:\n${err.message}。`);
        }

        const nodeToString = function(node) {
            return node.toString();
        };

        return nodes.map(nodeToString).join(delimiter);
    }

}

export default XPathExpression;
