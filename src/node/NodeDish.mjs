/**
 * @author d98762625 [d98762625@gmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import util from "util";
import Dish from "../core/Dish.mjs";

/**
 * Dish 的子类，用于 Node.js 环境。添加了一些辅助函数，并改进了 Node.js 日志记录的强制转换。
 */
class NodeDish extends Dish {

    /**
    * 创建 Dish
    * @param {any} inputOrDish - Dish 输入
    * @param {String|Number} - Dish 类型，枚举或字符串
    */
    constructor(inputOrDish=null, type=null) {

        // Allow `fs` file input:
        // Any node fs Buffers transformed to array buffer
        // Use Array.from as Uint8Array doesnt pass instanceof Array test
        if (Buffer.isBuffer(inputOrDish)) {
            inputOrDish = Array.from(inputOrDish);
            type = Dish.BYTE_ARRAY;
        }
        super(inputOrDish, type);
    }

    /**
     * 将输入的操作应用于 Dish。
     *
     * @param {WrappedOperation} operation 要执行的操作
     * @param {*} args - 操作的任何参数
     * @returns {Dish} 包含操作结果的新 Dish。
     */
    apply(operation, args=null) {
        return operation(this, args);
    }

    /**
     * get 的别名
     * @param args 请参阅 get 的参数
     */
    to(...args) {
        return this.get(...args);
    }

    /**
     * 避免强制转换为 String 原始类型。
     */
    toString() {
        return this.presentAs(Dish.typeEnum("string"));
    }

    /**
     * 我们想要记录到控制台的内容。
     */
    [util.inspect.custom](depth, options) {
        return this.presentAs(Dish.typeEnum("string"));
    }

    /**
     * 向后兼容 Node v6
     * 仅将值记录到 Node 中的控制台。
     */
    inspect() {
        return this.presentAs(Dish.typeEnum("string"));
    }

    /**
     * 避免强制转换为 Number 原始类型。
     */
    valueOf() {
        return this.presentAs(Dish.typeEnum("number"));
    }

}

export default NodeDish;
