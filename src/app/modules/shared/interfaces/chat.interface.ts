import { Role } from '../types/role.type';

export interface IHistory {
  role: Role;
  content: string;
  dashboardUrl?: string;
}

export interface IChatRequest {
  message: string;
  history?: IHistory[];
}

export interface IChatResponse {
  success: boolean;
  data: Data;
  error: any;
}

interface Data {
  filter: Filter;
  chatbot: Chatbot;
  board: Board;
}

interface Filter {
  status: 'valid' | 'invalid' | 'incomplete' | 'error' | 'unknown';
  message: string;
  query_details?: QueryDetails;
  suggestion?: string;
  missing_fields?: string[];
}

interface QueryDetails {
  tematica: string;
  tipo_analisis: string;
  indicador: string;
  operador: string;
  tecnologia: string;
  departamento: string;
  municipio: string;
  localidad: string;
  ambito: string;
  fecha: string;
}

interface Chatbot {
  rag_raw_sql?: string;
  results?: Result[];
  natural_language: string;
  status?: string;
  error?: string;
}

interface Result {
  ANNO: number;
  MES: number;
  DPTO_CNMBR: string;
  MPIO_CNMBR: string;
  MUNICIPIO: number;
  TECNOLOGIA: string;
  ISP: string;
  AMBITO: string;
  INDICADOR: string;
  VALOR_CLARO: number;
  VALOR_TIGO: number;
  VALOR_MOVISTAR: number;
  VALOR_WOM: number;
}

interface Board {
  board_url?: string;
  status?: string;
  error?: string;
}
