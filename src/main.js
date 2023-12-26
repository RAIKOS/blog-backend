require('dotenv').config();
// 백엔드 웹서버
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';

import api from './api';
import createFakeData from './createFakeData';

const { PORT, MONGO_URI } = process.env;

// MongoDB 실행 : mongod --dbpath=D:\Java\Workspace_React
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MONGO DB');
    //createFakeData();
  })
  .catch((e) => {
    console.error(e);
  });

const app = new Koa();
const router = new Router();

// 라우터 설정
router.use('/api', api.routes());

// bodyParser 적용
app.use(bodyParser());

// 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

const port = PORT || 4000;

app.listen(4000, () => {
  console.log('Listening to port %d', port);
});
