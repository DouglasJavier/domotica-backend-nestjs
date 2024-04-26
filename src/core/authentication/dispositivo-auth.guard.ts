import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class DispositivoAuthGuard extends AuthGuard('dispositivo') {}
