export class PaginacionQueryDto {
  limite?: number;
  salto?: number;
  sentido?: 'ASC' | 'DESC';
  campo?: string;
}

export class IntervaloFechasDto {
  fechaInicio: string;
  fechaFin: string;
}
