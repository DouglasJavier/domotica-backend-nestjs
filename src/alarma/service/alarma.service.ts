import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Alarma } from '../entity/alarmas.entity';
import { AlarmaRepository } from '../repository/alarma.repository';
import { AlarmaCRUDType } from '../dto/alarmaCRUDType';
import { HistorialActivarDesactivarRepository } from 'src/historialActivarDesactivar/historialActivarDesactivar.repository';
import { AlarmaContactoRepository } from 'src/alarma/repository/alarmasContactos.repository';
import { UbicacionAlarma } from 'src/alarma/entity/ubicacionesAlarmas.entity';

@Injectable()
export class AlarmaService {
  constructor(
    @Inject(AlarmaRepository)
    private alarmaRepository: AlarmaRepository,
    private historialRepository: HistorialActivarDesactivarRepository,
    private alarmasContactosRepository: AlarmaContactoRepository,
    private ubicacionesAlarmasRepository: ubicacionAlarmaRepository,
  ) {}
  async listaAlarmas() {
    const respuesta = this.alarmaRepository.listaAlarmas();
    return respuesta;
  }
  async alarmaPorId(id: string) {
    const alarma = this.alarmaRepository.buscarPorId(id);
    if (!alarma) throw new NotFoundException('Articulo no encontrado');
    return alarma;
  }
  async crear(alarmaDto: AlarmaCRUDType) {
    const result = await this.alarmaRepository.crear(alarmaDto);
    this.historialRepository.crear({
      accion: 'CREAR',
      fecha: new Date(),
      idAlarma: result.id,
      idUsuario: '1',
    });
    return result;
  }
  async editar(alarmaDto: AlarmaCRUDType, id: string) {
    const existe = this.alarmaRepository.buscarPorId(id);
    if (!existe)
      throw new NotFoundException('No existe el articulo selecionado');
    this.alarmasContactosRepository.inactivarContactos(id);
    this.ubicacionesAlarmasRepository.inactivarUbicaciones(id);
    const result = await this.alarmaRepository.editar(alarmaDto, id);
    this.historialRepository.crear({
      accion: 'EDITAR',
      fecha: new Date(),
      idAlarma: id,
      idUsuario: '1',
    });
    return result;
  }
  async encender(id: string) {
    const existe = this.alarmaRepository.buscarPorId(id);
    if (!existe)
      throw new NotFoundException('No existe el articulo selecionado');
    const result = await this.alarmaRepository.encender(id);
    this.historialRepository.crear({
      accion: 'ENCENDER',
      fecha: new Date(),
      idAlarma: id,
      idUsuario: '1',
    });
    return result;
  }
  async apagar(id: string) {
    const existe = this.alarmaRepository.buscarPorId(id);
    if (!existe)
      throw new NotFoundException('No existe el articulo selecionado');
    const result = await this.alarmaRepository.apagar(id);
    this.historialRepository.crear({
      accion: 'APAGAR',
      fecha: new Date(),
      idAlarma: id,
      idUsuario: '1',
    });
    return result;
  }
  async inactivar(id: string) {
    const existe = this.alarmaRepository.buscarPorId(id);
    if (!existe)
      throw new NotFoundException('No existe el articulo selecionado');
    const result = await this.alarmaRepository.inactivar(id);
    this.historialRepository.crear({
      accion: 'ELIMINAR',
      fecha: new Date(),
      idAlarma: id,
      idUsuario: '1',
    });
    return result;
  }
}
