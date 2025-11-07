export interface IChat {
  pregunta: string;
}

export interface IChatResponse {
  pregunta: string;
  timestamp: string;
  filtros: Filtros;
  respuesta: string;
  status: string;
}

interface Filtros {
  pertinencia: Pertinencia;
  tematica: Tematica;
  tipo_analisis: TipoAnalisis;
  ubicacion: Ubicacion;
  tecnologias: Tecnologias;
  operador: Operador;
  dominio_tematico: DominioTematico;
}

interface DominioTematico {
  error: string;
}

interface Operador {
  filtro: string;
  operadores_detectados: string[];
  motivo: string;
  score: number;
}

interface Pertinencia {
  filtro: string;
  pertinente: boolean;
  motivo: string;
  score: number;
}

interface Tecnologias {
  filtro: string;
  tecnologias_detectadas: string[];
  motivo: string;
  score: number;
}

interface Tematica {
  filtro: string;
  tematica_detectada: string;
  motivo: string;
  score: number;
}

interface TipoAnalisis {
  filtro: string;
  tema: string;
  tipo_de_analisis: string;
  motivo: string;
  score: number;
}

interface Ubicacion {
  ubicacion_detectada: string;
  categoria_detectada: string;
  nivel: string;
  dentro_del_dominio: boolean;
  motivo: string;
  score: number;
}
