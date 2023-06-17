"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUID = exports.generateMembersUID = void 0;
const nanoid_1 = require("nanoid");
const nanoid_dictionary_1 = require("nanoid-dictionary");
function generateMembersUID() {
    const generate10UniqueNumbers = (0, nanoid_1.customAlphabet)(nanoid_dictionary_1.numbers, 10);
    const uniqueId = `FBIMS${generate10UniqueNumbers()}`;
    return uniqueId;
}
exports.generateMembersUID = generateMembersUID;
function generateUID() {
    return (0, nanoid_1.nanoid)(15);
}
exports.generateUID = generateUID;
