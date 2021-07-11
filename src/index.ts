import chalk from 'chalk';
import https from 'https';
import fs from 'fs';
import app from './app';

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  console.log(chalk.green(`✅ App is running on http://localhost:${port} in ${app.get('env')} mode`));
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
      cert: fs.readFileSync(process.env.SSL_CERTIFICATE_PATH),
      key: fs.readFileSync(process.env.SSL_PRIVATE_KEY_PATH),
    };
    console.log(sslOptions);
    https.createServer(sslOptions, app).listen(443);
    console.log(chalk.green(`✅ Secure app is running on http://localhost:443 in ${app.get('env')} mode`));
  } catch (e) {
    console.log(chalk.yellow(e));
    console.log(chalk.red('❌ Failed to load certs so not creating https server'));
  }
}

export default server;
