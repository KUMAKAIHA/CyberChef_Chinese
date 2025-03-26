/**
 * Interactive script for generating a new operation template.
 *
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

/* eslint no-console: ["off"] */

import prompt from "prompt";
import colors from "colors";
import process from "process";
import fs from "fs";
import path from "path";
import EscapeString from "../../operations/EscapeString.mjs";


const dir = path.join(process.cwd() + "/src/core/operations/");
if (!fs.existsSync(dir)) {
    console.log("\nCWD: " + process.cwd());
    console.log("Error: newOperation.mjs should be run from the project root");
    console.log("Example> node --experimental-modules src/core/config/scripts/newOperation.mjs");
    process.exit(1);
}

const ioTypes = ["string", "byteArray", "number", "html", "ArrayBuffer", "BigNumber", "JSON", "File", "List<File>"];

const schema = {
    properties: {
        opName: {
            description: "操作名称应该简短但具有描述性。",
            example: "URL Decode",
            prompt: "操作名称",
            type: "string",
            pattern: /^[\w\s-/().]+$/,
            required: true,
            message: "操作名称应由字母、数字或以下符号组成： _-/()."
        },
        module: {
            description: `模块用于对依赖大型库的操作进行分组。 任何不在默认模块中的操作将在首次调用时动态加载。 同一模块中的所有操作也将在此时加载。 此系统可防止 CyberChef Web 应用程序过于臃肿并导致初始加载时间过长。\n如果您的操作不依赖于任何库，请留空，它将被添加到默认模块。 如果它依赖于与其他操作相同的库，请输入这些操作所在的模块名称。 如果它依赖于新的大型库，请输入新的模块名称（首字母大写）。`,
            example: "Crypto",
            prompt: "模块",
            type: "string",
            pattern: /^[A-Z][A-Za-z\d]+$/,
            message: "模块名称应以大写字母开头，并且不包含任何空格或符号。",
            default: "Default"
        },
        description: {
            description: "描述应解释操作是什么以及它是如何工作的。 它可以描述如何输入参数，并提供预期输入和输出的示例。 支持 HTML 标记。 对示例使用 <code> 标签。 描述会在搜索期间被扫描，因此请包含在有人查找您的操作时可能搜索的术语。",
            example: "Converts URI/URL percent-encoded characters back to their raw values.<br><br>e.g. <code>%3d</code> becomes <code>=</code>",
            prompt: "描述",
            type: "string"
        },
        infoURL: {
            description: "可以添加指向外部站点的可选 URL，以提供有关操作的更多信息。 Wikipedia 链接通常是合适的。 如果链接到 Wikipedia，请使用国际链接（例如 https://wikipedia.org/...）而不是本地化链接（例如 https://en.wikipedia.org/...）。",
            example: "https://wikipedia.org/wiki/Percent-encoding",
            prompt: "信息 URL",
            type: "string",
        },
        inputType: {
            description: `输入类型定义了输入数据将如何呈现给您的操作。 请查看项目 Wiki 以获取每种类型的完整描述。 选项包括：${ioTypes.join(", ")}。`,
            example: "string",
            prompt: "输入类型",
            type: "string",
            pattern: new RegExp(`^(${ioTypes.join("|")})`),
            required: true,
            message: `输入类型应为以下之一：${ioTypes.join(", ")}。`
        },
        outputType: {
            description: `输出类型告诉 CyberChef 您从操作返回的数据类型。 请查看项目 Wiki 以获取每种类型的完整描述。 选项包括：${ioTypes.join(", ")}。`,
            example: "string",
            prompt: "输出类型",
            type: "string",
            pattern: new RegExp(`^(${ioTypes.join("|")})`),
            required: true,
            message: `输出类型应为以下之一：${ioTypes.join(", ")}。`
        },
        highlight: {
            description: "如果您的操作不会以任何方式更改输入的长度，我们可以启用高亮显示。 如果它确实以可预测的方式更改了长度，我们仍然可能能够启用高亮显示并计算正确的偏移量。 如果不可能，我们将禁用此操作的高亮显示。",
            example: "true/false",
            prompt: "启用高亮显示",
            type: "boolean",
            default: "false",
            message: "输入 true 或 false 以指定是否应启用高亮显示。"
        },
        authorName: {
            description: "您的姓名或用户名将添加到此操作的 @author 标签。",
            example: "n1474335",
            prompt: "用户名",
            type: "string"
        },
        authorEmail: {
            description: "您的电子邮件地址也将添加到此操作的 @author 标签。",
            example: "n1474335@gmail.com",
            prompt: "电子邮件",
            type: "string"
        }
    }
};

// Build schema
for (const prop in schema.properties) {
    const p = schema.properties[prop];
    p.description = "\n" + colors.white(p.description) + colors.cyan("\nExample: " + p.example) + "\n" + colors.green(p.prompt);
}

console.log("\n\n此脚本将根据您提供的信息生成新的操作模板。 这些值稍后可以手动更改。".yellow);

prompt.message = "";
prompt.delimiter = ":".green;

prompt.start();

prompt.get(schema, (err, result) => {
    if (err) {
        console.log("\n退出构建脚本。");
        process.exit(0);
    }

    const moduleName = result.opName.replace(/\w\S*/g, txt => {
        return txt.charAt(0).toUpperCase() + txt.substr(1);
    }).replace(/[\s-()./]/g, "");


    const template = `/**
 * @author ${result.authorName} [${result.authorEmail}]
 * @copyright Crown Copyright ${(new Date()).getFullYear()}
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * ${result.opName} operation
 */
class ${moduleName} extends Operation {

    /**
     * ${moduleName} constructor
     */
    constructor() {
        super();

        this.name = "${result.opName}";
        this.module = "${result.module}";
        this.description = "${(new EscapeString).run(result.description, ["Special chars", "Double"])}";
        this.infoURL = "${result.infoURL}"; // Usually a Wikipedia link. Remember to remove localisation (i.e. https://wikipedia.org/etc rather than https://en.wikipedia.org/etc)
        this.inputType = "${result.inputType}";
        this.outputType = "${result.outputType}";
        this.args = [
            /* Example arguments. See the project wiki for full details.
            {
                name: "First arg",
                type: "string",
                value: "Don't Panic"
            },
            {
                name: "Second arg",
                type: "number",
                value: 42
            }
            */
        ];
    }

    /**
     * @param {${result.inputType}} input
     * @param {Object[]} args
     * @returns {${result.outputType}}
     */
    run(input, args) {
        // const [firstArg, secondArg] = args;

        throw new OperationError("Test");
    }
${result.highlight ? `
    /**
     * Highlight ${result.opName}
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlight(pos, args) {
        return pos;
    }

    /**
     * Highlight ${result.opName} in reverse
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlightReverse(pos, args) {
        return pos;
    }
` : ""}
}

export default ${moduleName};
`;

    // console.log(template);

    const filename = path.join(dir, `./${moduleName}.mjs`);
    if (fs.existsSync(filename)) {
        console.log(`${filename} 已存在。 它没有被覆盖。`.red);
        console.log("选择不同的操作名称以避免冲突。");
        process.exit(0);
    }
    fs.writeFileSync(filename, template);

    console.log(`\n操作模板已写入 ${colors.green(filename)}`);
    console.log(`\n下一步：
1. 将您的操作添加到 ${colors.green("src/core/config/Categories.json")}
2. 编写您的操作代码。
3. 在 ${colors.green("tests/operations/tests/")} 中编写测试
4. 运行 ${colors.cyan("npm run lint")} 和 ${colors.cyan("npm run test")}
5. 提交 Pull Request 以将您的操作添加到官方 CyberChef 存储库。`);

});
