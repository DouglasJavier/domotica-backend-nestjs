import {
  /*   BadRequestException, */
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  /*   Req,
  Res, */
} from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthService } from './authentication.service'
import { LoginAuthDto } from './authentication.dto'
import { JwtAuthGuard } from './jwt-auth.guard'
import { LocalAuthGuard } from './local-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private autenticacionService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('')
  async login(@Body() loginBody: LoginAuthDto) {
    return this.autenticacionService.autenticar(loginBody)
  }
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    console.log('entro a logout')
    // req.logout();
    req.destroy()

    return res.status(200).json()
  }
}
