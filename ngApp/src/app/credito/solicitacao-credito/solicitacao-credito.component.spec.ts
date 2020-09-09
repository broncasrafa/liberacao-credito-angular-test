import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitacaoCreditoComponent } from './solicitacao-credito.component';

describe('SolicitacaoCreditoComponent', () => {
  let component: SolicitacaoCreditoComponent;
  let fixture: ComponentFixture<SolicitacaoCreditoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitacaoCreditoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitacaoCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
