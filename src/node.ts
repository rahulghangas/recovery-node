import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateShare, GetShare } from './request-types';
import * as db from './utils/kvwrapper';
import { sleep } from './utils/helpers';
import * as fs from 'fs';

const snarkjs = require('snarkjs');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/createshare', async (req: Request, res: Response) => {
  const user = plainToInstance(CreateShare, req.body);
  const errors = await validate(user);
  if (errors.length > 0) {
    res.status(400).send(errors);
  }

  const key = user.address;
  const value = JSON.stringify({hash: user.hash, share: user.share});
  await db.addOrUpdateKeyValue(key, value);
  res.send('share submitted succesfully!');
  
});

app.get('/getshare', async (req: Request, res: Response) => {
    const proof = plainToInstance(GetShare, req.body);
    const errors = await validate(proof);
    if (errors.length > 0) {
        res.status(400).send(errors);
    }

    const vKey = JSON.parse(fs.readFileSync("verification_key.json").toString());
    const verificationResult = await snarkjs.groth16.verify(vKey, proof.public_signals, proof.proof);

    if (verificationResult === true) {
        const key = proof.address;
        let value!: string;
        try {
            value = await db.getValueFromKey(key);
            res.send(value);
        } catch(e) {
            res.status(400).send('share not found');
        } 
    }
});

export const main = async () => {
    while (!db.isDbOpen()) {
        console.log('waiting for db to open');
        sleep(3000);
    }
    app.listen(3000, () => {
    console.log('Server started on port 3000!');
    });
};