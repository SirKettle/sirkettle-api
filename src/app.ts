import DotEnv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import pkg from '../package.json';
import * as events from './events';
import * as ipAddress from './ipAddress';
import * as twitter from './twitter';
import * as blog from './blog';
import { isOriginAllowed } from './utils/cors';
import { getRandomPie } from './random';

// dotenv variables now available
DotEnv.config();
twitter.init();

// Our Express APP config
const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

app.use(helmet());

app.use(express.static(path.join(__dirname, '../static')));

app.set('port', process.env.PORT || 80);

export const linkHtml = (text: string, link?: string) => `<a href="${link || text}">${text}</a>`;

// API Endpoints
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
      <title>${pkg.name}</title>
      </head>
      <body>
        <h1>Available endpoints</h1>
        <ul>
          <li>GET ${linkHtml('/pie')} (returns a random, but always delicious, pie)</li>
          <li>GET ${linkHtml('/ipv4')}</li>
          <li>GET ${linkHtml('/twitter/tweets/:userId', '/twitter/tweets/thirkettle?count=5')}</li>
          <li>GET ${linkHtml('/twitter/legacy-tweets/:userId', '/twitter/legacy-tweets/thirkettle?count=5')}</li>
          <li>GET ${linkHtml(
            '/twitter/legacy-tweets',
            '/twitter/legacy-tweets?user=thirkettle&count=5'
          )} (requires a ?user=query)</li>
          <li>GET ${linkHtml('/events/:appId', '/events/loisthirkettle')}</li>
          <li>GET ${linkHtml('/events/:appId/:eventId', '/events/loisthirkettle/designermakers21')}</li>
        </ul>
      </body>
    </html>
  `);
});
app.get('/ipv4', ipAddress.getPublicV4);

app.get('/blog/posts-and-tweets', blog.getPostsAndTweetsRequest);
app.get('/blog/posts/:userId', blog.getBlogPostsRequest);
app.get('/twitter/tweets/:userId', twitter.getUserTweetsRequest);
app.get('/twitter/legacy-tweets/:userId', twitter.getUserTweetsLegacy);
app.get('/twitter/legacy-tweets', twitter.getUserTweetsLegacy);
app.get('/events/:appId', events.getAppEvents);
app.get('/events/:appId/:eventId', events.getAppEvent);
app.get('/pie', (_req, res) => {
  res.send(getRandomPie());
});

// http://api.thekettlestudio.co.uk/api/json.php/events
// http://api.thekettlestudio.co.uk/api/json.php/events/designermakers21

// app.get('/twitter/images/:userId', twitter.getUserImages);

// export our app
export default app;
