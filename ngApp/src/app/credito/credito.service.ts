import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResultInfo } from '../shared/models/result-info.model';
import {
  LinhaCredito,
  SolicitaCredito,
  DadosSolicitacaoCliente
} from '../shared/models/credito.model';


@Injectable({
  providedIn: 'root'
})
export class CreditoService {

  base_url: string = environment.base_api_url;


  constructor(
    private http: HttpClient
  ) { }

  consultarListaEstados(): Observable<any[]> {
    return this.http.get<any[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
  }

  consultarTodosTiposCredito(): Observable<ResultInfo<LinhaCredito[]>> {
    return this.http.get<ResultInfo<LinhaCredito[]>>(this.base_url + "/linhas", { responseType: 'json'});
  }

  consultarTipoCredito(id: number): Observable<ResultInfo<LinhaCredito>> {
    return this.http.get<ResultInfo<LinhaCredito>>(this.base_url + "/linhas/info/"+ id, { responseType: 'json'});
  }

  solicitarCredito(credito: SolicitaCredito): Observable<any> {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.post<SolicitaCredito>(this.base_url + '/solicitar', credito, { headers });
  }

  efetuarSolicitacao(dadosSolicitacaoCliente: DadosSolicitacaoCliente): Observable<any> {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.post<DadosSolicitacaoCliente>(this.base_url + '/efetuar', dadosSolicitacaoCliente, { headers });
  }
}
// { 'Authorization': 'Bearer meu-token' }
