import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateShare, GetShare } from './request-types';
import * as db from './utils/kvwrapper';
import { sleep } from './utils/helpers';
import * as fs from 'fs';
import { PROJECT_DIR } from '../settings';
import path from 'path';

const snarkjs = require('snarkjs');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/createshare', async (req: Request, res: Response) => {
  const createShare = plainToInstance(CreateShare, req.body as unknown);
  const errors = await validate(createShare);
  if (errors.length > 0) {
    res.status(400).send(errors);
  } else {
    const key = createShare.address;
    const value = JSON.stringify({hash: createShare.hash, share: createShare.share});
    await db.addOrUpdateKeyValue(key, value);
    res.send('share submitted succesfully!');
  }
  
});

app.get('/getshare', async (req: Request, res: Response) => {
    const proof = plainToInstance(GetShare, req.body as unknown);
    const errors = await validate(proof);
    if (errors.length > 0) {
        res.status(400).send(errors);
    } else {

        const vKey = JSON.parse(fs.readFileSync(path.join(PROJECT_DIR, "recovery-circom/circuits", "verification_key.json")).toString());
        
        let verificationResult = true;
        try {
            verificationResult = await snarkjs.groth16.verify(vKey, proof.public_signals, proof.proof);
        } catch(err) {
            console.log(err);
            res.status(400).send("invalid proof");
        }

        if (verificationResult === true) {
            const key = proof.address;
            let value!: string;
            try {
                value = await db.getValueFromKey(key);
                const valueObject: {hash: string, share: string} = JSON.parse(value);
                res.send(valueObject.share);
            } catch(e) {
                res.status(400).send('share not found');
            } 
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