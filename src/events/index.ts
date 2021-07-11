import type { Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import type { IEvent } from './types';

export const fetchAppEvents = (appId: string): Promise<IEvent[]> =>
  new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, `../../data/events/${appId}.json`))
      .then((buffer) => {
        try {
          const results: IEvent[] = JSON.parse(buffer.toString());
          resolve(results);
        } catch (error) {
          reject(error);
        }
      })
      .catch((error) => {
        reject({
          error: `Events not found for ${appId}`,
        });
      });
  });

export const getAppEvents = (req: Request, res: Response) => {
  const { appId } = req.params;
  try {
    fetchAppEvents(appId)
      .then((results) => {
        res.send(results);
      })
      .catch((error) => {
        res.status(404);
        res.send({
          error,
        });
      });
  } catch (error) {
    res.status(400);
    res.send({
      error,
    });
  }
};

export const getAppEvent = (req: Request, res: Response) => {
  const { appId, eventId } = req.params;
  try {
    fetchAppEvents(appId)
      .then((results) => {
        const event: IEvent = results.find((e) => e.id === eventId);
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
  } catch (error) {
    res.status(400);
    res.send({
      error,
    });
  }
};
