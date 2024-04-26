import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1713128626904 implements MigrationInterface {
    name = 'Init1713128626904'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "proyecto"."horarios" ("id" BIGSERIAL NOT NULL, "horaInicio" TIMESTAMP WITH TIME ZONE NOT NULL, "horaFin" TIMESTAMP WITH TIME ZONE NOT NULL, "estado" character varying(20) NOT NULL, "id_simulador_actuador" bigint NOT NULL, CONSTRAINT "PK_c69b602fc8441125f1310a4858d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "proyecto"."ubicacionesAlarmas" ("id" BIGSERIAL NOT NULL, "estado" character varying(20) NOT NULL, "idUbicacion" bigint NOT NULL, "idAlarma" bigint NOT NULL, CONSTRAINT "PK_021586089b072beddf8dbf74c20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "proyecto"."ubicaciones" ("id" BIGSERIAL NOT NULL, "nombre" character varying(50) NOT NULL, "estado" character varying(20) NOT NULL, CONSTRAINT "PK_a9ce0b671142b83ebff02722cf9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "proyecto"."dispositivos" ("id" BIGSERIAL NOT NULL, "nombre" character varying(50) NOT NULL, "tipo" character varying(50) NOT NULL, "direccionLan" character varying(200) NOT NULL, "direccionWan" character varying(200), "contrasenia" character varying(120) NOT NULL, "estado" character varying(20) NOT NULL, "idUbicacion" bigint NOT NULL, CONSTRAINT "PK_e9595bb1be0bf2b2e376b904434" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "proyecto"."fotosIncidentes" ("id" BIGSERIAL NOT NULL, "foto" character varying NOT NULL, "id_incidente" bigint NOT NULL, CONSTRAINT "PK_612b2423754ce28fa263082d308" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "proyecto"."historialActivarDesactivar" ("id" BIGSERIAL NOT NULL, "fecha" TIMESTAMP WITH TIME ZONE NOT NULL, "accion" character varying(50) NOT NULL, "estado" character varying(20) NOT NULL, "idAlarma" bigint NOT NULL, "idUsuario" bigint NOT NULL, CONSTRAINT "PK_2a75f7f606cf6def915f3bc4618" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "usuarios"."usuario" ("id" BIGSERIAL NOT NULL, "nombres" character varying(60) NOT NULL, "apellidos" character varying(60) NOT NULL, "usuario" character varying(60) NOT NULL, "contrasenia" character varying(120) NOT NULL, "estado" character varying(50) NOT NULL, "rol" character varying(60) NOT NULL, "idTelegram" character varying(60) NOT NULL, "intentos" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_a56c58e5cabaa04fb2c98d2d7e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "proyecto"."historialIncidentes" ("id" BIGSERIAL NOT NULL, "fecha" TIMESTAMP WITH TIME ZONE NOT NULL, "feacha_atencion" TIMESTAMP WITH TIME ZONE, "estado" character varying(20) NOT NULL, "usuario_auditoria" bigint, "idAlarma" bigint NOT NULL, "id_sensor" bigint, CONSTRAINT "PK_93b41a55cace0854c234a67e361" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "proyecto"."sensores_actuadores" ("id" BIGSERIAL NOT NULL, "pin" character varying(5) NOT NULL, "tipo" character varying(25) NOT NULL, "descripcion" character varying NOT NULL, "tipo_salida" character varying(10) NOT NULL, "id_ubicacion" bigint NOT NULL, "estado" character varying(20) NOT NULL, "id_dispositivo" bigint NOT NULL, CONSTRAINT "PK_c62ec2b169b1473df74917703a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "proyecto"."simulador_actuador" ("id" BIGSERIAL NOT NULL, "id_actuador" bigint NOT NULL, "estado" character varying(50) NOT NULL, "id_simulador" bigint NOT NULL, CONSTRAINT "PK_66604bf9c5fe1aedd839c31ac9f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "proyecto"."simuladores" ("id" BIGSERIAL NOT NULL, "nombre" character varying(50) NOT NULL, "estado" character varying(50) NOT NULL, CONSTRAINT "PK_5cc60dc0e90db5002140f762331" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "proyecto"."alarmas" ("id" BIGSERIAL NOT NULL, "estado" character varying(20) NOT NULL, "nombre" character varying(50) NOT NULL, "sonido" character varying(2) NOT NULL, "envio_noti" character varying(50) NOT NULL, "alumbrado_automatico" boolean NOT NULL DEFAULT false, "seguridad_bienes" boolean NOT NULL DEFAULT false, "sensores_humo" boolean NOT NULL DEFAULT false, "id_simulador" bigint, CONSTRAINT "UQ_9e1f69b5bd740f24abda5524e71" UNIQUE ("nombre"), CONSTRAINT "PK_758c6f6910aff9112bb4544b4a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "proyecto"."alarmasContactos" ("id" BIGSERIAL NOT NULL, "estado" character varying(20) NOT NULL, "idAlarma" bigint NOT NULL, "idContacto" bigint NOT NULL, CONSTRAINT "PK_6ab2b7b466500cd190e466a6d70" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "proyecto"."contactos" ("id" BIGSERIAL NOT NULL, "nombre" character varying(50) NOT NULL, "apellido" character varying(50) NOT NULL, "numeroTel1" character varying(50) NOT NULL, "numeroTel2" character varying(50), "estado" character varying(50) NOT NULL, CONSTRAINT "UQ_123342eb51afe2fb8570511ae4e" UNIQUE ("numeroTel1"), CONSTRAINT "PK_d8a88d3690915aba8dc617a7ffd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "usuarios"."casbin_rule" ("id" SERIAL NOT NULL, "ptype" character varying, "v0" character varying, "v1" character varying, "v2" character varying, "v3" character varying, "v4" character varying, "v5" character varying, "v6" character varying, CONSTRAINT "PK_e147354d31e2748a3a5da5e3060" PRIMARY KEY ("id")); COMMENT ON COLUMN "usuarios"."casbin_rule"."id" IS 'Clave primaria de la tabla CasbinRule'; COMMENT ON COLUMN "usuarios"."casbin_rule"."ptype" IS 'Tipo de política (p,g)'; COMMENT ON COLUMN "usuarios"."casbin_rule"."v0" IS 'Regla de acceso (roles)'; COMMENT ON COLUMN "usuarios"."casbin_rule"."v1" IS 'Regla de acceso (rutas)'; COMMENT ON COLUMN "usuarios"."casbin_rule"."v2" IS 'Regla de acceso (GET, POST, PATCH, DELETE para backend y read, update, create y delete para frontend)'; COMMENT ON COLUMN "usuarios"."casbin_rule"."v3" IS 'Regla de acceso (Backend, Frontend)'; COMMENT ON COLUMN "usuarios"."casbin_rule"."v4" IS 'Regla de acceso'; COMMENT ON COLUMN "usuarios"."casbin_rule"."v5" IS 'Regla de acceso'; COMMENT ON COLUMN "usuarios"."casbin_rule"."v6" IS 'Regla de acceso'`);
        await queryRunner.query(`ALTER TABLE "proyecto"."horarios" ADD CONSTRAINT "FK_2481328f2967aa5e489d4c0dcde" FOREIGN KEY ("id_simulador_actuador") REFERENCES "proyecto"."simulador_actuador"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "proyecto"."ubicacionesAlarmas" ADD CONSTRAINT "FK_1a6878f2e81bbccb236fac406b3" FOREIGN KEY ("idUbicacion") REFERENCES "proyecto"."ubicaciones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "proyecto"."ubicacionesAlarmas" ADD CONSTRAINT "FK_4ab2946040a2d31cdf1a6de8db7" FOREIGN KEY ("idAlarma") REFERENCES "proyecto"."alarmas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "proyecto"."dispositivos" ADD CONSTRAINT "FK_ffe40c495e54db37cc1dc7b6992" FOREIGN KEY ("idUbicacion") REFERENCES "proyecto"."ubicaciones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "proyecto"."fotosIncidentes" ADD CONSTRAINT "FK_39e335fe0b724d57dec24777890" FOREIGN KEY ("id_incidente") REFERENCES "proyecto"."historialIncidentes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "proyecto"."historialActivarDesactivar" ADD CONSTRAINT "FK_f20c61949ef5dd890540c13090a" FOREIGN KEY ("idAlarma") REFERENCES "proyecto"."alarmas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "proyecto"."historialActivarDesactivar" ADD CONSTRAINT "FK_93ebca6f192547abad561e89cdf" FOREIGN KEY ("idUsuario") REFERENCES "usuarios"."usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "proyecto"."historialIncidentes" ADD CONSTRAINT "FK_422cf516f4339b3cd879ae2f724" FOREIGN KEY ("usuario_auditoria") REFERENCES "usuarios"."usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "proyecto"."historialIncidentes" ADD CONSTRAINT "FK_3e752b22fa4425bbf3311fe09d6" FOREIGN KEY ("idAlarma") REFERENCES "proyecto"."alarmas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "proyecto"."historialIncidentes" ADD CONSTRAINT "FK_79f7813706d3ba7cbd7e39e445f" FOREIGN KEY ("id_sensor") REFERENCES "proyecto"."sensores_actuadores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "proyecto"."sensores_actuadores" ADD CONSTRAINT "FK_32150a0611e7e27703ef61cdcfb" FOREIGN KEY ("id_ubicacion") REFERENCES "proyecto"."ubicaciones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "proyecto"."sensores_actuadores" ADD CONSTRAINT "FK_fccfdd24c763a4588ae52e9fe3a" FOREIGN KEY ("id_dispositivo") REFERENCES "proyecto"."dispositivos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "proyecto"."simulador_actuador" ADD CONSTRAINT "FK_f4092375a3e8222f86c92b9a68b" FOREIGN KEY ("id_actuador") REFERENCES "proyecto"."sensores_actuadores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "proyecto"."simulador_actuador" ADD CONSTRAINT "FK_38e97f27b177ff1276505360cb1" FOREIGN KEY ("id_simulador") REFERENCES "proyecto"."simuladores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "proyecto"."alarmas" ADD CONSTRAINT "FK_b7230bf636e3ec377068fbb74bd" FOREIGN KEY ("id_simulador") REFERENCES "proyecto"."simuladores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "proyecto"."alarmasContactos" ADD CONSTRAINT "FK_3139dc8063176e25215558e688b" FOREIGN KEY ("idAlarma") REFERENCES "proyecto"."alarmas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "proyecto"."alarmasContactos" ADD CONSTRAINT "FK_f9b446eb39c63a2aae397cc5689" FOREIGN KEY ("idContacto") REFERENCES "proyecto"."contactos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "proyecto"."alarmasContactos" DROP CONSTRAINT "FK_f9b446eb39c63a2aae397cc5689"`);
        await queryRunner.query(`ALTER TABLE "proyecto"."alarmasContactos" DROP CONSTRAINT "FK_3139dc8063176e25215558e688b"`);
        await queryRunner.query(`ALTER TABLE "proyecto"."alarmas" DROP CONSTRAINT "FK_b7230bf636e3ec377068fbb74bd"`);
        await queryRunner.query(`ALTER TABLE "proyecto"."simulador_actuador" DROP CONSTRAINT "FK_38e97f27b177ff1276505360cb1"`);
        await queryRunner.query(`ALTER TABLE "proyecto"."simulador_actuador" DROP CONSTRAINT "FK_f4092375a3e8222f86c92b9a68b"`);
        await queryRunner.query(`ALTER TABLE "proyecto"."sensores_actuadores" DROP CONSTRAINT "FK_fccfdd24c763a4588ae52e9fe3a"`);
        await queryRunner.query(`ALTER TABLE "proyecto"."sensores_actuadores" DROP CONSTRAINT "FK_32150a0611e7e27703ef61cdcfb"`);
        await queryRunner.query(`ALTER TABLE "proyecto"."historialIncidentes" DROP CONSTRAINT "FK_79f7813706d3ba7cbd7e39e445f"`);
        await queryRunner.query(`ALTER TABLE "proyecto"."historialIncidentes" DROP CONSTRAINT "FK_3e752b22fa4425bbf3311fe09d6"`);
        await queryRunner.query(`ALTER TABLE "proyecto"."historialIncidentes" DROP CONSTRAINT "FK_422cf516f4339b3cd879ae2f724"`);
        await queryRunner.query(`ALTER TABLE "proyecto"."historialActivarDesactivar" DROP CONSTRAINT "FK_93ebca6f192547abad561e89cdf"`);
        await queryRunner.query(`ALTER TABLE "proyecto"."historialActivarDesactivar" DROP CONSTRAINT "FK_f20c61949ef5dd890540c13090a"`);
        await queryRunner.query(`ALTER TABLE "proyecto"."fotosIncidentes" DROP CONSTRAINT "FK_39e335fe0b724d57dec24777890"`);
        await queryRunner.query(`ALTER TABLE "proyecto"."dispositivos" DROP CONSTRAINT "FK_ffe40c495e54db37cc1dc7b6992"`);
        await queryRunner.query(`ALTER TABLE "proyecto"."ubicacionesAlarmas" DROP CONSTRAINT "FK_4ab2946040a2d31cdf1a6de8db7"`);
        await queryRunner.query(`ALTER TABLE "proyecto"."ubicacionesAlarmas" DROP CONSTRAINT "FK_1a6878f2e81bbccb236fac406b3"`);
        await queryRunner.query(`ALTER TABLE "proyecto"."horarios" DROP CONSTRAINT "FK_2481328f2967aa5e489d4c0dcde"`);
        await queryRunner.query(`DROP TABLE "usuarios"."casbin_rule"`);
        await queryRunner.query(`DROP TABLE "proyecto"."contactos"`);
        await queryRunner.query(`DROP TABLE "proyecto"."alarmasContactos"`);
        await queryRunner.query(`DROP TABLE "proyecto"."alarmas"`);
        await queryRunner.query(`DROP TABLE "proyecto"."simuladores"`);
        await queryRunner.query(`DROP TABLE "proyecto"."simulador_actuador"`);
        await queryRunner.query(`DROP TABLE "proyecto"."sensores_actuadores"`);
        await queryRunner.query(`DROP TABLE "proyecto"."historialIncidentes"`);
        await queryRunner.query(`DROP TABLE "usuarios"."usuario"`);
        await queryRunner.query(`DROP TABLE "proyecto"."historialActivarDesactivar"`);
        await queryRunner.query(`DROP TABLE "proyecto"."fotosIncidentes"`);
        await queryRunner.query(`DROP TABLE "proyecto"."dispositivos"`);
        await queryRunner.query(`DROP TABLE "proyecto"."ubicaciones"`);
        await queryRunner.query(`DROP TABLE "proyecto"."ubicacionesAlarmas"`);
        await queryRunner.query(`DROP TABLE "proyecto"."horarios"`);
    }

}
