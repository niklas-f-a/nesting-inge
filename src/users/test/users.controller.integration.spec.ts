import { Test, TestingModule } from '@nestjs/testing';
import { stringify } from 'querystring';

import { User } from '../schemas/user.schema';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUserService = {
    create: jest.fn((dto): User => {
      return {
        _id: Date.now(),
        role: 'client',
        ...dto,
      };
    }),
    signup: jest.fn((password: string, userName: string): string => {
      password;
      userName;
      return 'jwttoken';
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('Controller should be defined', async () => {
    expect(controller).toBeDefined();
  });

  it('Should create a user', () => {
    const userDto = {
      name: 'harry',
      email: 'harry@bingo.com',
      hashPassword: 'jbefkjbd',
    };
    expect(mockUserService.create(userDto)).toEqual({
      _id: expect.any(Number),
      name: userDto.name,
      email: userDto.email,
      role: expect.any(String),
      hashPassword: expect.any(String),
    });
  });
});
