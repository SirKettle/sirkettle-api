"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const app_1 = __importDefault(require("./app"));
const server = app_1.default.listen(app_1.default.get('port'), () => {
    console.log(chalk_1.default.green(`✅ App is running on http://localhost:${app_1.default.get('port')} in ${app_1.default.get('env')} mode`));
});
// Set up express server here
if (process.env.SSL_CERTIFICATE_PATH && process.env.SSL_PRIVATE_KEY_PATH) {
    console.log('SSL Certificate paths');
    console.log({
        cert: process.env.SSL_CERTIFICATE_PATH,
        key: process.env.SSL_PRIVATE_KEY_PATH,
    });
    try {
        const sslOptions = {
            cert: fs_1.default.readFileSync(process.env.SSL_CERTIFICATE_PATH),
            key: fs_1.default.readFileSync(process.env.SSL_PRIVATE_KEY_PATH),
        };
        console.log(sslOptions);
        https_1.default.createServer(sslOptions, app_1.default).listen(443);
        console.log(chalk_1.default.green(`✅ Secure app is running on http://localhost:443 in ${app_1.default.get('env')} mode`));
    }
    catch (e) {
        console.log(chalk_1.default.yellow(e));
        console.log(chalk_1.default.red('❌ Failed to load certs so not creating https server'));
    }
}
exports.default = server;
//# sourceMappingURL=index.js.map