export class PaginacionQueryDto {
  limite?: number
  pagina?: number
  sentido?: 'ASC' | 'DESC'
  campo?: string
  estado?: string
  get salto(): number {
    return (this.pagina - 1) * this.limite
  }
}

export class IntervaloFechasDto {
  fechaInicio: string
  fechaFin: string
}
