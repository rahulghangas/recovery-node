import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateShare, GetShare } from './request-types';

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/createshare', async (req: Request, res: Response) => {
  const user = plainToInstance(CreateShare, req.body);
  const errors = await validate(user);
  if (errors.length > 0) {
    res.status(400).send(errors);
  } else {
    res.send('User successfully created!');
  }

  
});

app.get('/getshare', async (req: Request, res: Response) => {
    const user = plainToInstance(GetShare, req.body);
    const errors = await validate(user);
    if (errors.length > 0) {
        res.status(400).send(errors);
    } else {
        res.send('User successfully created!');
    }
});

app.listen(3000, () => {
  console.log('Server started on port 3000!');
});