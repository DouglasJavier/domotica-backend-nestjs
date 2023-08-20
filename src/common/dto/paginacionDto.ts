export class PaginacionQueryDto {
  limite?: number;
  salto?: number;
  sentido?: 'ASC' | 'DESC';
  campo?: string;
}
