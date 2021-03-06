"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.arrayToHex = exports.formatTags = exports.unpackTags = exports.getTag = void 0;
function getTag(tx, name) {
    const tags = tx.get('tags');
    for (const tag of tags) {
        // decoding tags can throw on invalid utf8 data.
        try {
            if (tag.get('name', { decode: true, string: true }) === name) {
                return tag.get('value', { decode: true, string: true });
            }
            // tslint:disable-next-line: no-empty
        }
        catch (e) { }
    }
    return false;
}
exports.getTag = getTag;
/**
 * Unpacks string tags from a Tx and puts in a KV map
 * Tags that appear multiple times will be converted to an
 * array of string values, ordered as they appear in the tx.
 *
 * @param tx
 */
function unpackTags(tx) {
    const tags = tx.tags;
    const result = {};
    for (const tag of tags) {
        try {
            const name = tag.get('name', { decode: true, string: true });
            const value = tag.get('value', { decode: true, string: true });
            if (!result.hasOwnProperty(name)) {
                result[name] = value;
                continue;
            }
            result[name] = [...result[name], value];
        }
        catch (e) {
            // ignore tags with invalid utf-8 strings in key or value.
        }
    }
    return result;
}
exports.unpackTags = unpackTags;
function formatTags(tags) {
    const result = {};
    for (const tag of tags) {
        const { name, value } = tag;
        if (!result.hasOwnProperty(name)) {
            result[name] = value;
            continue;
        }
        result[name] = [...result[name], value];
    }
    return result;
}
exports.formatTags = formatTags;
function arrayToHex(arr) {
    let str = '';
    for (const a of arr) {
        str += ('0' + a.toString(16)).slice(-2);
    }
    return str;
}
exports.arrayToHex = arrayToHex;
function log(arweave, ...str) {
    if (!arweave || !arweave.getConfig().api.logging)
        return;
    typeof arweave.getConfig().api.logger === 'function' ? arweave.getConfig().api.logger(...str) : console.log(...str);
}
exports.log = log;
