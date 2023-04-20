"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomPie = exports.randomItem = exports.pies = void 0;
exports.pies = ['blueberry', 'apple', 'steak and ale', 'chicken and mushroom'];
var randomItem = function (items) { return items[Math.floor(Math.random() * items.length)]; };
exports.randomItem = randomItem;
var getRandomPie = function () { return exports.randomItem(exports.pies); };
exports.getRandomPie = getRandomPie;
//# sourceMappingURL=index.js.map