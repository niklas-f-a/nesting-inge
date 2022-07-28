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
} from '@nestjs/common';
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
}
