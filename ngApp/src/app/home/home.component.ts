import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreditoService } from './../credito/credito.service';
import { LinhaCredito } from '../shared/models/credito.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  listaOpcoesCredito: LinhaCredito[];

  constructor(
    private router: Router,
    private creditoService: CreditoService
  ) {

  }
  ngOnInit() {
    this.carregarOpcoesCredito();
  }

  redirecionarSolicitarCredito(tipoCredito: number) {
    const redirectToUrl = `/solicitacao-credito/${tipoCredito + 1}`;
    this.router.navigate([redirectToUrl]);
  }

  carregarOpcoesCredito() {
    this.creditoService.consultarTodosTiposCredito()
      .subscribe((resp) => this.listaOpcoesCredito = resp.data);
  }

}
