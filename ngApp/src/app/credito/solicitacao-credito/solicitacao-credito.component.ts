import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditoService } from '../credito.service';
import { Util } from '../../shared/utils/utils';
import { MaskInputUtil } from '../../shared/utils/mask-inputs-utils';
import { UnMaskInputUtil } from 'src/app/shared/utils/unmask-inputs-utils';
import {
  SolicitaCredito,
  DadosSolicitacaoCliente,
  LinhaCredito
} from '../../shared/models/credito.model';


@Component({
  selector: 'app-solicitacao-credito',
  templateUrl: './solicitacao-credito.component.html',
  styleUrls: ['./solicitacao-credito.component.css']
})
export class SolicitacaoCreditoComponent implements OnInit {

  form: FormGroup;

  mostrarBlocoEfetuar = false;
  mostrarBlocoSolicitar = true;
  mostrarResultadoSolicitacaoErro = false;
  solicitarClicked = false;
  desabilitarBotao = false;
  desabilitarBotaoEfetuar = false;

  mostrarNotificacao = false;
  notificacao_sucesso = false;
  notificacao_erro = false;
  notificacao_mensagem: string;

  tipoCredito: string;
  descCredito: string;
  taxaCredito: string;

  parcelas: any[];
  errors: string[];
  estadosUf: any[];

  credito: SolicitaCredito;
  valorTotalComJuros: number;
  valorJuros: number;
  valorParcela: number;

  valorTotalComJurosFormatado: string;
  valorJurosFormatado: string;
  valorParcelaFormatado: string;

  maskCpf = MaskInputUtil.maskCpf;
  maskCnpj = MaskInputUtil.maskCnpj;
  maskCelular = MaskInputUtil.maskCelular;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private creditoService: CreditoService
  ) { }


  ngOnInit() {
    this.activatedRoute.params
      .subscribe((parameter) => {
        this.tipoCredito = parameter.id;
      });

    // busca os dados da taxa
    this.creditoService.consultarTipoCredito(parseInt(this.tipoCredito))
      .subscribe((resp) => {
        this.descCredito = resp.data.descricao;
        this.taxaCredito = resp.data.taxa;
      });

    this.initializeFormFields();
    this.carregarListaEstados();
  }

  initializeFormFields() {
    const frmBuilder = this.formBuilder;

    this.form = frmBuilder.group({
      solicitacao: frmBuilder.group({
        valorCredito: [null, [Validators.required, Validators.maxLength(9)]],
        tipoCredito: this.tipoCredito,
        qtdeParcelas: [null, [Validators.required]],
        dataPrimeiroVencimento: [null, [Validators.required]]
      }),

      dadosCliente: frmBuilder.group({
        nome: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(100) ]],
        celular: [null, [Validators.required, Validators.maxLength(11)]],
        email: [null, [Validators.required, Validators.email]],
        cpf: [null, [Validators.required, Validators.maxLength(11)]],
        cnpj: [null, [Validators.required, Validators.maxLength(14)]],
        uf:[null]
      })
    });

    // this.form.valueChanges.subscribe(form => {
    //   if(form.solicitacao.valorCredito) {
    //     this.form.patchValue({
    //       valorCredito: this.currencyPipe.transform(form.solicitacao.valorCredito.replace(/\D/g, '').replace(/^0+/, ''), 'BRL', 'symbol', '1.2-2')
    //     }, { emitEvent: false});
    //   }
    // });

    this.preencherQuantidadeParcelas();
  }

  onSubmit() {
    if (this.solicitarClicked) {
      this.solicitarCredito();
    } else {
      this.efetuarSolicitacaoCredito();
    }
  }

  onSolicitarClick() {
    this.solicitarClicked = true;
  }
  onEfetuarClick() {
    this.solicitarClicked = false;
  }



  solicitarCredito() {
    const dadosSolicitacao = this.form.value.solicitacao;

    this.credito = new SolicitaCredito();
    this.credito.TipoCredito = parseInt(this.tipoCredito);
    this.credito.ValorCredito = dadosSolicitacao.valorCredito;
    this.credito.QtdeParcelas = parseInt(dadosSolicitacao.qtdeParcelas);
    this.credito.DataPrimeiroVencimento = new Date(Util.getDataFormatada(dadosSolicitacao.dataPrimeiroVencimento));

    this.creditoService.solicitarCredito(this.credito)
      .subscribe((res) => {
        if(res.data.statusCredito === 'Aprovado') {
          this.valorTotalComJuros = res.data.dadosRetornoSolicitacao.valorTotalComJuros;
          this.valorJuros = res.data.dadosRetornoSolicitacao.valorJuros;
          this.valorParcela = res.data.dadosRetornoSolicitacao.valorParcela;

          this.valorTotalComJurosFormatado = res.data.dadosRetornoSolicitacao.valorTotalComJurosFormatado;
          this.valorJurosFormatado = res.data.dadosRetornoSolicitacao.valorJurosFormatado;
          this.valorParcelaFormatado = res.data.dadosRetornoSolicitacao.valorParcelaFormatado;

          this.mostrarBlocoEfetuar = true;
          this.mostrarResultadoSolicitacaoErro = false;
          this.form.controls.solicitacao.disable();
          this.desabilitarBotao = true;
        } else {
          // mostrar alguma coisa que foi recusado
          this.mostrarBlocoEfetuar = false;
          this.mostrarResultadoSolicitacaoErro = true;
          this.errors = res.data.erros;
        }

      },
      error => {
        this.mostrarNotificacao = true;
        this.notificacao_erro = true;
        this.notificacao_mensagem = 'Ocorreu um erro ao tentar solicitar o crédito';
        setTimeout(() => {
          this.mostrarNotificacao = false;
          this.notificacao_erro = false;
          this.notificacao_mensagem = '';
        }, 5000);
      }
    );
  }


  efetuarSolicitacaoCredito() {
    const dadosCliente = this.form.value.dadosCliente;

    const dadosSolicitacao = new DadosSolicitacaoCliente();
    dadosSolicitacao.Nome = dadosCliente.nome;
    dadosSolicitacao.Celular = dadosCliente.celular;
    dadosSolicitacao.Email = dadosCliente.email;
    dadosSolicitacao.Cpf = dadosCliente.cpf;
    dadosSolicitacao.Cnpj = dadosCliente.cnpj;
    dadosSolicitacao.Uf = dadosCliente.uf; //dadosCliente.Uf;

    dadosSolicitacao.ValorCredito = this.credito.ValorCredito;
    dadosSolicitacao.TipoCredito = this.credito.TipoCredito;
    dadosSolicitacao.QtdeParcelas = this.credito.QtdeParcelas;
    dadosSolicitacao.DataPrimeiroVencimento = this.credito.DataPrimeiroVencimento;
    dadosSolicitacao.ValorTotal = this.valorTotalComJuros;
    dadosSolicitacao.ValorJuros = this.valorJuros;
    dadosSolicitacao.ValorParcela = this.valorParcela;

    this.removerMascarasFormatacao(dadosSolicitacao);

    this.creditoService.efetuarSolicitacao(dadosSolicitacao)
      .subscribe((res) => {
        this.desabilitarBotaoEfetuar = true;
        this.mostrarNotificacao = true;
        this.notificacao_sucesso = true;
        this.notificacao_mensagem = 'Solicitação do crédito efetuada com sucesso';
        setTimeout(() => {
          this.mostrarNotificacao = false;
          this.notificacao_sucesso = false;
          this.notificacao_mensagem = '';

          this.router.navigate(['/']);

        }, 5000);

      },
      error => {
        this.mostrarNotificacao = true;
        this.notificacao_erro = true;
        this.notificacao_mensagem = 'Ocorreu um erro ao tentar efetuar a solicitação do crédito';
        setTimeout(() => {
          this.mostrarNotificacao = false;
          this.notificacao_erro = false;
          this.notificacao_mensagem = '';
        }, 5000);
      }
    );
  }

  removerMascarasFormatacao(dadosSolicitacao: DadosSolicitacaoCliente) {
    dadosSolicitacao.Celular = UnMaskInputUtil.removeMaskCelular(dadosSolicitacao.Celular);
    dadosSolicitacao.Cpf = dadosSolicitacao.Cpf == null ? null : UnMaskInputUtil.removeMaskCpf(dadosSolicitacao.Cpf);
    dadosSolicitacao.Cnpj = dadosSolicitacao.Cnpj == null ? null : UnMaskInputUtil.removeMaskCnpj(dadosSolicitacao.Cnpj);
    return dadosSolicitacao;
  }

  preencherQuantidadeParcelas() {
    this.parcelas = [];
    for (let i = 5; i < 73; i++) {
      this.parcelas.push(i);
    }
  }

  carregarListaEstados() {
    this.creditoService.consultarListaEstados()
      .subscribe((res) => this.estadosUf = res);
  }

}
