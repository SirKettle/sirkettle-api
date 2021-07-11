"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkHtml = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const events = __importStar(require("./events"));
const ipAddress = __importStar(require("./ipAddress"));
const twitter = __importStar(require("./twitter"));
const cors_2 = require("./utils/cors");
const random_1 = require("./random");
// dotenv variables now available
dotenv_1.default.config();
twitter.init();
// Our Express APP config
const app = express_1.default();
app.use(cors_1.default({
    origin: function (origin, callback) {
        if (cors_2.isOriginAllowed(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
}));
app.use(helmet_1.default());
app.use(express_1.default.static(path_1.default.join(__dirname, '../static')));
app.set('port', process.env.PORT || 80);
const linkHtml = (text, link) => `<a href="${link || text}">${text}</a>`;
exports.linkHtml = linkHtml;
// API Endpoints
app.get('/', (req, res) => {
    res.send(`
    <html>
      <head>
      <title>pi-api</title>
      </head>
      <body>
        <h1>Available endpoints</h1>
        <ul>
          <li>GET ${exports.linkHtml('/pie')} (returns a random, but always delicious, pie)</li>
          <li>GET ${exports.linkHtml('/ipv4')}</li>
          <li>GET ${exports.linkHtml('/twitter/tweets/:userId', '/twitter/tweets/thirkettle?count=5')}</li>
          <li>GET ${exports.linkHtml('/twitter/legacy-tweets/:userId', '/twitter/legacy-tweets/thirkettle?count=5')}</li>
          <li>GET ${exports.linkHtml('/twitter/legacy-tweets', '/twitter/legacy-tweets?user=thirkettle&count=5')} (requires a ?user=query)</li>
          <li>GET ${exports.linkHtml('/events/:appId', '/events/loisthirkettle')}</li>
          <li>GET ${exports.linkHtml('/events/:appId/:eventId', '/events/loisthirkettle/designermakers21')}</li>
        </ul>
      </body>
    </html>
  `);
});
app.get('/ipv4', ipAddress.getPublicV4);
app.get('/twitter/tweets/:userId', twitter.getUserTweets);
app.get('/twitter/legacy-tweets/:userId', twitter.getUserTweetsLegacy);
app.get('/twitter/legacy-tweets', twitter.getUserTweetsLegacy);
app.get('/events/:appId', events.getAppEvents);
app.get('/events/:appId/:eventId', events.getAppEvent);
app.get('/pie', (_req, res) => {
    res.send(random_1.getRandomPie());
});
// http://api.thekettlestudio.co.uk/api/json.php/events
// http://api.thekettlestudio.co.uk/api/json.php/events/designermakers21
// app.get('/twitter/images/:userId', twitter.getUserImages);
// export our app
exports.default = app;
//# sourceMappingURL=app.js.map