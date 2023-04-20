"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppEvent = exports.getAppEvents = exports.fetchAppEvents = void 0;
var fs_1 = require("fs");
var path_1 = __importDefault(require("path"));
var fetchAppEvents = function (appId) {
    return new Promise(function (resolve, reject) {
        fs_1.promises.readFile(path_1.default.resolve(__dirname, "../../data/events/" + appId + ".json"))
            .then(function (buffer) {
            try {
                var results = JSON.parse(buffer.toString());
                resolve(results);
            }
            catch (error) {
                reject(error);
            }
        })
            .catch(function (error) {
            reject({
                error: "Events not found for " + appId,
            });
        });
    });
};
exports.fetchAppEvents = fetchAppEvents;
var getAppEvents = function (req, res) {
    var appId = req.params.appId;
    try {
        exports.fetchAppEvents(appId)
            .then(function (results) {
            res.send(results);
        })
            .catch(function (error) {
            res.status(404);
            res.send({
                error: error,
            });
        });
    }
    catch (error) {
        res.status(400);
        res.send({
            error: error,
        });
    }
};
exports.getAppEvents = getAppEvents;
var getAppEvent = function (req, res) {
    var _a = req.params, appId = _a.appId, eventId = _a.eventId;
    try {
        exports.fetchAppEvents(appId)
            .then(function (results) {
            var event = results.find(function (e) { return e.id === eventId; });
            if (event) {
                res.send(event);
                return;
            }
            res.status(404);
            res.send({
                error: "Event (" + eventId + ") not found in events for " + appId,
            });
        })
            .catch(function (error) {
            res.status(404);
            res.send({
                error: error,
            });
        });
    }
    catch (error) {
        res.status(400);
        res.send({
            error: error,
        });
    }
};
exports.getAppEvent = getAppEvent;
//# sourceMappingURL=index.js.map