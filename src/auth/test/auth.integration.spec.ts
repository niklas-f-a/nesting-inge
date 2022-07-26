import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import * as request from 'supertest';

import { AppModule } from '../../app.module';
import { DatabaseService } from '../../database/database.service';
import { adminStub } from '../../users/test/stubs/user.stub';

describe('UsersController', () => {
  let dbConnection: Connection;
  let httpServer: any;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getDbHandle();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await dbConnection.collection('users').deleteMany({});
  });

  describe('Login', () => {
    let user;
    let token: string;

    it('Should login and return jwt-token', async () => {
      user = adminStub();
      await dbConnection.collection('users').insertOne(user);
      const res = await request(httpServer)
        .post('/auth/login')
        .send({ email: user.email, password: 'password' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        access_token: expect.any(String),
      });
      token = res.body.access_token;
    });

    it('Should return the user', async () => {
      user = adminStub();
      const isInserted = await dbConnection.collection('users').insertOne(user);
      delete user.hashPassword;
      const loginRes = await request(httpServer)
        .post('/auth/login')
        .send({ email: user.email, password: 'password' });

      const { access_token } = loginRes.body;

      const res = await request(httpServer)
        .get('/auth/me')
        .set('Authorization', `Bearer ${access_token}`)
        .expect(200);

      expect(res.body).toMatchObject({
        sub: isInserted.insertedId,
        email: user.email,
        name: user.name,
        role: user.role,
      });
    });
  });
});
