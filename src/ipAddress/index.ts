import { Request, Response } from 'express';
import { v4 } from 'public-ip';

export const getPublicIpV4 = async () => {
  const ipv4 = await v4();
  return ipv4;
};

export const getPublicV4 = (req: Request, res: Response) => {
  getPublicIpV4().then((ip) => {
    res.send({ ip });
  });
};
