/**
 * Node 环境的实用工具函数
 *
 * @author d98762625 [d98762625@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */


/**
 * someName => Somename
 *
 * @param {String} str - 要修改的字符串
 * @returns {String}
 */
const capitalise = function capitalise(str) {
    // Don't edit names that start with 2+ caps
    if (/^[A-Z0-9]{2,}/g.test(str)) {
        return str;
    }
    // reserved. Don't change for now.
    if (str === "Return") {
        return str;
    }

    return `${str.charAt(0).toUpperCase()}${str.substr(1).toLowerCase()}`;
};


/**
 * SomeName => someName
 * @param {String} name - 要修改的字符串
 * @returns {String} decapitalised
 */
export function decapitalise(str) {
    // Don't decapitalise str that start with 2+ caps
    if (/^[A-Z0-9]{2,}/g.test(str)) {
        return str;
    }
    // reserved. Don't change for now.
    if (str === "Return") {
        return str;
    }

    return `${str.charAt(0).toLowerCase()}${str.substr(1)}`;
}


/**
 * 从给定数组中移除以 [] 包围的字符串。
*/
export function removeSubheadingsFromArray(array) {
    if (Array.isArray(array)) {
        return array.filter((i) => {
            if (typeof i === "string") {
                return !i.match(/^\[[\s\S]*\]$/);
            }
            return true;
        });
    }
}


/**
 * 移除空格，转换为小写。
 * @param str
 */
export function sanitise(str) {
    return str.replace(/ /g, "").toLowerCase();
}


/**
 * something like this => somethingLikeThis
 * ABC a sentence => ABCASentence
*/
export function sentenceToCamelCase(str) {
    return str.split(" ")
        .map((s, index) => {
            if (index === 0) {
                return decapitalise(s);
            }
            return capitalise(s);
        })
        .reduce((prev, curr) => `${prev}${curr}`, "");
}
