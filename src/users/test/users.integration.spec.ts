import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'mongoose';
import * as request from 'supertest';

import { AppModule } from '../../app.module';
import { DatabaseService } from '../../database/database.service';
import { UsersController } from '../users.controller';
import { adminStub } from './stubs/user.stub';

describe('UsersController', () => {
  let controller: UsersController;
  let dbConnection: Connection;
  let app: INestApplication;
  let httpServer: any;

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

  describe('Creating user', () => {
    let access_token: string;
    it('Should create a user', async () => {
      const admin = adminStub();
      await dbConnection.collection('users').insertOne(admin);
      const userDto = {
        email: 'harry@bingo.com',
        hashPassword: 'harryspass',
      };
      const adminLoginRes = await request(httpServer)
        .post('/auth/login')
        .send({ email: admin.email, password: 'password' });

      ({ access_token } = adminLoginRes.body);

      const response = await request(httpServer)
        .post('/users')
        .set('Authorization', `Bearer ${access_token}`)
        .send({ ...userDto })
        .expect(201);

      expect(response.body).toMatchObject({
        _id: expect.any(String),
        email: userDto.email,
        role: 'client',
        hashPassword: expect.any(String),
      });
    });
  });
});
