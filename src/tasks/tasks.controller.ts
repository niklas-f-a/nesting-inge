import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Put,
  UploadedFile,
  UseInterceptors,
  MaxFileSizeValidator,
  ParseFilePipe,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express } from 'express';
import * as fs from 'fs';
import * as path from 'path';

import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, CreateMessageDto } from './dto/';
import { Roles } from 'src/auth/decorators';
import { Role } from 'src/auth/enums/role-enum';
import { Task, Message } from './schemas/task.schema';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Roles(Role.ADMIN, Role.CLIENT, Role.WORKER)
  @Get()
  async findAll(@Req() req): Promise<Task[]> {
    return await this.tasksService.findAll(req.user.role, req.user.sub);
  }

  @Roles(Role.ADMIN, Role.CLIENT, Role.WORKER)
  @Get(':id')
  async findOne(@Req() req, @Param('id') id: string): Promise<Task> {
    return await this.tasksService.findOne(id, req.user);
  }

  @Roles(Role.WORKER)
  @Post()
  async create(
    @Req() req,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    return await this.tasksService.create(createTaskDto, req.user.sub);
  }

  @Roles(Role.WORKER)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return await this.tasksService.update(id, updateTaskDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<string> {
    return await this.tasksService.remove(id);
  }

  @Roles(Role.CLIENT, Role.WORKER)
  @Put(':id/messages')
  async addMessage(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: CreateMessageDto,
  ): Promise<Task> {
    return await this.tasksService.addMessage(id, req.user.sub, dto);
  }

  @Roles(Role.ADMIN, Role.CLIENT, Role.WORKER)
  @Get(':id/messages')
  async getTaskMessages(
    @Req() req,
    @Param('id') id: string,
  ): Promise<{ messages: Message[] }> {
    return await this.tasksService.getMessages(id, req.user);
  }

  @Roles(Role.ADMIN, Role.CLIENT, Role.WORKER)
  @Delete(':id/messages/:messageId')
  async deleteMessage(
    @Param('id') id: string,
    @Param('messageId') messageId: string,
    @Req() req,
  ) {
    return await this.tasksService.deleteMessage(id, messageId, req.user);
  }

  @Roles(Role.WORKER)
  @Post(':id/images')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          cb(
            new HttpException(
              'file must be type image',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        } else if (fs.existsSync(path.join('uploads', file.originalname))) {
          cb(
            new HttpException(
              `${file.originalname} Already exists`,
              HttpStatus.CONFLICT,
            ),
            false,
          );
        } else {
          cb(null, true);
        }
      },
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  async addImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5242880 })],
      }),
    )
    file: Express.Multer.File,
    @Param('id') taskId: string,
    @Req() req,
  ): Promise<string> {
    return await this.tasksService.validateUpload(
      file.filename,
      taskId,
      req.user.sub,
    );
  }

  @Roles(Role.ADMIN, Role.WORKER, Role.CLIENT)
  @Get(':id/images')
  async getImage(@Param('id') taskId: string, @Req() req, @Res() res) {
    res.sendFile(
      path.resolve(await this.tasksService.downLoadImage(taskId, req.user)),
    );
  }

  @Roles(Role.ADMIN)
  @Delete(':id/images')
  async deleteImage(@Param('id') taskId): Promise<string> {
    return await this.tasksService.deleteImage(taskId);
  }
}
