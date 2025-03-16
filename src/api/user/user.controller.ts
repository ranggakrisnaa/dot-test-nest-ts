import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ISuccessResponse } from 'src/common/interfaces/success.interface';
import { AuthGuard } from 'src/guards/auth.service';
import { UpdateUserDto } from './dto/update.dto';
import { UserService } from './user.service';

@Controller('v1/users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('insert-data')
  async insertDataFromApi(): Promise<ISuccessResponse<any>> {
    return await this.userService.insertDataFromApi();
  }

  @Get()
  async getAllUsers(): Promise<ISuccessResponse<any>> {
    return await this.userService.getAllUsers();
  }

  @Get(':userId')
  async getUserDetail(
    @Param(':userId') userId: string,
  ): Promise<ISuccessResponse<any>> {
    return await this.userService.getUserDetail(userId);
  }

  @Patch(':userId')
  async updateUser(
    @Body() reqBody: UpdateUserDto,
    @Param(':userId') userId: string,
  ) {
    return await this.userService.updateUser(reqBody, userId);
  }

  @Delete(':userId')
  async deleteUser(@Param(':userId') userId: string) {
    return await this.userService.deleteUser(userId);
  }
}
