export class SolicitaCredito {
  ValorCredito: number;
  TipoCredito: number;
  QtdeParcelas: number;
  DataPrimeiroVencimento: Date;
}

export class DadosSolicitacaoCliente {
  Nome: string;
  Celular: string;
  Email: string;
  Cpf: string;
  Cnpj: string;
  Uf: string;
  ValorCredito: number;
  TipoCredito: number;
  QtdeParcelas: number;
  DataPrimeiroVencimento: Date;
  ValorTotal: number;
  ValorJuros: number;
  ValorParcela: number;
}

export class LinhaCredito {
  descricao: string;
  taxa: string;
}
