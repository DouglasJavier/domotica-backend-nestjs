import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Alarma } from '../entity/alarmas.entity';
import { AlarmaCRUDType } from '../dto/alarmaCRUDType';
import { Simulador } from 'src/simulador/entity/simulador.entity';
import { AlarmaContacto } from 'src/alarma/entity/alarmasContactos.entity';
import { UbicacionAlarma } from 'src/ubicacionesAlarmas/ubicacionesAlarmas.entity';

@Injectable()
export class AlarmaRepository {
  constructor(private dataSource: DataSource) {}
  async listaAlarmas() {
    const respuesta = await this.dataSource
      .getRepository(Alarma)
      .createQueryBuilder('alarma')
      .select(['alarma'])
      .getMany();
    return respuesta;
  }
  async buscarPorId(id: string) {
    const alarma = await this.dataSource
      .getRepository(Alarma)
      .createQueryBuilder('alarma')
      .select(['alarma'])
      .where('alarma.id = :id', { id: id })
      .getOne();
    if (!alarma) throw new NotFoundException('Articulo no encontrado');
    return alarma;
  }
  async crear(alarmaDto: AlarmaCRUDType) {
    const alarma = new Alarma();
    alarma.nombre = alarmaDto.nombre;
    alarma.tipo = alarmaDto.tipo;
    alarma.envio_noti = alarmaDto.envio_noti;
    alarma.idSimulador = alarmaDto.idSimulador;
    alarma.sonido = alarmaDto.sonido;
    alarma.notificacion = alarmaDto.notificacion;
    alarma.idSimulador = alarmaDto.idSimulador;
    const result = await this.dataSource.getRepository(Alarma).save(alarma);
    await alarmaDto.idContactos.map(async (idContacto) => {
      const alarmaContacto = new AlarmaContacto();
      alarmaContacto.idContacto = idContacto;
      alarmaContacto.idAlarma = result.id;
      await this.dataSource.getRepository(AlarmaContacto).save(alarmaContacto);
    });
    await alarmaDto.idUbicaciones.map(async (idUbicacion) => {
      const alarmaUbicacion = new UbicacionAlarma();
      alarmaUbicacion.idUbicacion = idUbicacion;
      alarmaUbicacion.idAlarma = result.id;
      await this.dataSource
        .getRepository(UbicacionAlarma)
        .save(alarmaUbicacion);
    });
    return result;
  }
  async editar(alarmaDto: AlarmaCRUDType, id: string) {
    const alarma = new Alarma();
    alarma.nombre = alarmaDto.nombre;
    alarma.tipo = alarmaDto.tipo;
    alarma.envio_noti = alarmaDto.envio_noti;
    alarma.idSimulador = alarmaDto.idSimulador;
    alarma.sonido = alarmaDto.sonido;
    alarma.notificacion = alarmaDto.notificacion;
    alarma.idSimulador = alarmaDto.idSimulador;
    const result = await this.dataSource
      .getRepository(Alarma)
      .update(id, alarma);
    return result;
  }
  async encender(id: string) {
    const alarma = new Alarma();
    alarma.estado = 'ENCENDIDO';
    const result = await this.dataSource
      .getRepository(Alarma)
      .update(id, alarma);
    return result;
  }

  async apagar(id: string) {
    const alarma = new Alarma();
    alarma.estado = 'APAGADO';
    const result = await this.dataSource
      .getRepository(Alarma)
      .update(id, alarma);
    return result;
  }
  async inactivar(id: string) {
    const alarma = new Alarma();
    alarma.estado = 'INACTIVO';
    const result = await this.dataSource
      .getRepository(Alarma)
      .update(id, alarma);
    return result;
  }
}
