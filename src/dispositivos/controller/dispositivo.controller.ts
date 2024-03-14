import {
  Body,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { Response } from 'express'
import { Controller } from '@nestjs/common'
import { DispositivoService } from '../service/dispositivo.service'
import { PaginacionQueryDto } from 'src/common/dto/paginacionDto'
import { ParamIdDto } from 'src/common/dto/params-id.dto'
import { DispositivoCrearDto } from '../dto/crear-dispositivo.dto'
import { JwtAuthGuard } from 'src/core/authentication/jwt-auth.guard'
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard'
import axios from 'axios'

@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('dispositivos')
export class DispositivoController {
  constructor(private dispositivoServicio: DispositivoService) {}
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.dispositivoServicio.listar(paginacionQueryDto)
    return result
  }

  @Get('/listarActuadores')
  async listarActuadores() {
    const result = await this.dispositivoServicio.listarActuadores()
    return result
  }

  @Get('/camaras')
  async listarCamaras() {
    const result = await this.dispositivoServicio.listarCamaras()
    return result
  }
  @Post()
  async crear(@Req() req, @Body() parametroDto: DispositivoCrearDto) {
    const result = await this.dispositivoServicio.crear(parametroDto)
    return result
  }

  @Patch(':id')
  async actualizar(
    @Param() params: ParamIdDto,
    @Body() parametroDto: DispositivoCrearDto
  ) {
    const { id: idUbicacion } = params
    const result = await this.dispositivoServicio.actualizar(
      idUbicacion,
      parametroDto
    )
    return result
  }

  @Patch(':id/activar')
  async activar(@Param() params: ParamIdDto) {
    const { id: idUbicacion } = params
    const result = await this.dispositivoServicio.activar(idUbicacion)
    return result
  }

  @Patch(':id/inactivar')
  async inactivar(@Param() params: ParamIdDto) {
    const { id: idUbicacion } = params
    const result = await this.dispositivoServicio.inactivar(idUbicacion)
    return result
  }

  @Get(':id/stream')
  async getMjpeg(@Res() res: Response, @Param() params: ParamIdDto) {
    const { id: idCamara } = params

    const camara = await this.dispositivoServicio.buscarPorId(idCamara)
    if (!camara) throw new NotFoundException('Cámara  no encontrada')
    try {
      // Realiza una solicitud HTTP a la dirección de la cámara MJPEG
      const cameraUrl = `http://${camara.direccionLan}/mjpeg`
      const response = await axios.get(cameraUrl, {
        responseType: 'stream',
        headers: {
          Authorization: `Bearer ${camara.contrasenia}`,
        },
      })

      // Configura las cabeceras de la respuesta HTTP
      res.setHeader(
        'Content-Type',
        'multipart/x-mixed-replace; boundary=myboundary'
      )
      /* res.setHeader('HTTP/1.1 200 OK') */
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader(
        'Content-Type',
        'multipart/x-mixed-replace; boundary=123456789000000000000987654321'
      )
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')

      // Transmite el flujo MJPEG al cliente
      response.data.pipe(res)
      res.on('close', () => {
        console.log('Conexión cerrada por el cliente')

        // Elimina el cliente de la lista de clientes activos

        // Lógica para cerrar la conexión con la cámara
        console.log('Cerrando conexión con la cámara')
        // Ejemplo: Detener la transmisión con la cámara
        response.data.destroy()
      })
    } catch (error) {
      console.error('Error al obtener el flujo MJPEG:', error.message)
      res.status(500).send('Error al obtener el flujo MJPEG desde la cámara.')
    }
  }
}
/* async getMjpegStream(@Res() res) {
    // Configurar la URL de la cámara
    const cameraUrl = 'http://192.168.0.200/mjpeg'

    // Crear un stream MJPEG
    const mjpegStream = jpegStream(cameraUrl)

    // Configurar el consumidor MJPEG
    const consumer = new mjpegConsumer()

    // Pipe el stream de la cámara al consumidor MJPEG
    mjpegStream.pipe(consumer)

    // Enviar encabezados HTTP adecuados
    res.writeHead(200, {
      'Content-Type':
        'multipart/x-mixed-replace; boundary=' + consumer.boundary,
    })

    // Pipe el resultado al cliente
    consumer.pipe(res)

    // Manejar errores
    consumer.on('error', (error) => {
      console.error('Error en la transmisión MJPEG:', error.message)
      res.end()
    })
  } */
