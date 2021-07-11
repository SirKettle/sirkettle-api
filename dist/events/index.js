"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppEvent = exports.getAppEvents = exports.fetchAppEvents = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const fetchAppEvents = (appId) => new Promise((resolve, reject) => {
    fs_1.promises.readFile(path_1.default.resolve(__dirname, `../../data/events/${appId}.json`))
        .then((buffer) => {
        try {
            const results = JSON.parse(buffer.toString());
            resolve(results);
        }
        catch (error) {
            reject(error);
        }
    })
        .catch((error) => {
        reject({
            error: `Events not found for ${appId}`,
        });
    });
});
exports.fetchAppEvents = fetchAppEvents;
const getAppEvents = (req, res) => {
    const { appId } = req.params;
    try {
        exports.fetchAppEvents(appId)
            .then((results) => {
            res.send(results);
        })
            .catch((error) => {
            res.status(404);
            res.send({
                error,
            });
        });
    }
    catch (error) {
        res.status(400);
        res.send({
            error,
        });
    }
};
exports.getAppEvents = getAppEvents;
const getAppEvent = (req, res) => {
    const { appId, eventId } = req.params;
    try {
        exports.fetchAppEvents(appId)
            .then((results) => {
            const event = results.find((e) => e.id === eventId);
            if (event) {
                res.send(event);
                return;
            }
            res.status(404);
            res.send({
                error: `Event (${eventId}) not found in events for ${appId}`,
            });
        })
            .catch((error) => {
            res.status(404);
            res.send({
                error,
            });
        });
    }
    catch (error) {
        res.status(400);
        res.send({
            error,
        });
    }
};
exports.getAppEvent = getAppEvent;
//# sourceMappingURL=index.js.map