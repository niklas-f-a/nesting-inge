import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskDocument } from './schemas/task.schema';
import { Role } from '../auth/enums/role-enum';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    private usersService: UsersService,
  ) {}

  async findAll(userRole: string, userId: number): Promise<Task[]> {
    let tasks: Task[];
    switch (userRole) {
      case Role.CLIENT:
        tasks = await this.taskModel
          .find({ client: userId })
          .populate('client')
          .populate('worker')
          .exec();
        break;
      case Role.WORKER:
        tasks = await this.taskModel
          .find({ worker: userId })
          .populate('client')
          .populate('worker')
          .exec();
        break;
      default:
        tasks = await this.taskModel
          .find()
          .populate('client')
          .populate('worker')
          .exec();
    }
    return tasks;
  }

  async findOne(id: string, user: User): Promise<Task> {
    try {
      const task = await this.taskModel
        .findById(id)
        .populate<{ worker: User }>('worker')
        .populate<{ client: User }>('client')
        .exec();

      if (
        task.client._id.toString() === user.sub.toString() ||
        task.worker._id.toString() === user.sub.toString() ||
        user.role === Role.ADMIN
      ) {
        return task;
      } else {
        throw new ForbiddenException('Not your task');
      }
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async create(createTaskDto: CreateTaskDto, workerId: number): Promise<Task> {
    try {
      const client = await this.usersService.findById(createTaskDto.client);
      if (!client) {
        throw new BadRequestException('Client does not exist');
      }
      return await this.taskModel.create({
        ...createTaskDto,
        worker: workerId,
      });
    } catch (error) {
      throw new InternalServerErrorException('Wrooooong');
    }
  }

  async update(id: string, { task, imageLink, done }: UpdateTaskDto) {
    try {
      const updatedTask = await this.taskModel.findById(id).exec();
      console.log(updatedTask);

      if (!updatedTask) {
        throw new NotFoundException('Resource not found');
      }
      if (task) {
        updatedTask.task = task;
      }
      if (imageLink) {
        updatedTask.imageLink = imageLink;
      }
      if (done) {
        updatedTask.done = done;
      }
      return await updatedTask.save();
    } catch (error) {
      throw new InternalServerErrorException('Horrible');
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const deleteResult = await this.taskModel.deleteOne({ _id: id });
      if (deleteResult.deletedCount > 0) {
        return JSON.stringify(`Deleted task with task-id ${id}`);
      } else {
        throw new InternalServerErrorException(
          'Could not delete task with id ' + id,
        );
      }
    } catch (error) {
      throw new InternalServerErrorException('Problemo');
    }
  }
}
