import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ISuccessResponse } from '../../common/interfaces/success.interface';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { AuthGuard } from '../../guards/auth.service';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtPayloadType } from './types/jwt-payload.type';
import { Token } from './types/token.type';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(
    @Body() reqBody: SignInDto,
    @Req() request: Request,
  ): Promise<ISuccessResponse<Token>> {
    return await this.authService.signIn(reqBody, request);
  }

  @Post('sign-up')
  async signUp(@Body() reqBody: SignUpDto): Promise<ISuccessResponse<null>> {
    return await this.authService.signUp(reqBody);
  }

  @Post('refresh')
  async refreshToken(
    @Body() reqBody: RefreshTokenDto,
  ): Promise<ISuccessResponse<Token>> {
    return await this.authService.refreshToken(reqBody);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(
    @CurrentUser() userToken: JwtPayloadType,
  ): Promise<ISuccessResponse<null>> {
    return await this.authService.logout(userToken.id);
  }
}
