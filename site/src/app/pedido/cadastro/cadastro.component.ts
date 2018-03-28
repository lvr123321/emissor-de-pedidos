import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListModel } from '../../ui/frame';
import { ToolbarBuilder } from '../../ui/toolbar';
import { ProdutoService, Produto } from '../../produto';
import { Pedido, PedidoItem, PedidoPagamento } from '../../_model/pedido.model';

@Component({
	moduleId: module.id,
	selector: 'app-cadastro',
	templateUrl: './cadastro.component.html',
	styleUrls: ['./cadastro.component.css', '../lista/lista.component.css'],
	providers: [ToolbarBuilder, ProdutoService]
})
export class CadastroComponent implements OnInit {
	frame: ListModel;

	firstFormGroup: FormGroup;
	secondFormGroup: FormGroup;
	thirdFormGroup: FormGroup;

	produtos: Produto[];

	itemColumns = ['descricao', 'qtd', 'valor', 'total'];
	pagamentoColumns = ['especie', 'valor'];


	pedido: Pedido = {
		id: undefined,
		tipo: undefined,
		itens: [{id : 11, produtoId : 1, descricao: 'descricao do item 1' , valor : 1.99 , qtd : 1} ,
			{id : 12, produtoId : 2, descricao: 'descricao do item 2' , valor : 2.50 , qtd : 2} ,
			{id : 13, produtoId : 3, descricao: 'descricao do item 3' , valor : 3.00 , qtd : 3} ],
		pagamentos: [
			{ id: undefined, especie: 'dinheiro', parcelas: 0, valor: 0 },
			{ id: undefined, especie: 'debito', parcelas: 0, valor: 0 },
			{ id: undefined, especie: 'credito', parcelas: 0, valor: 0 }
			],
		destinatario: undefined,
		status: ""
	};

	pagamentos = {
		dinheiro : this.pedido.pagamentos[0].valor,
		debito : this.pedido.pagamentos[1].valor,
		credito : {
			valor : this.pedido.pagamentos[2].valor,
			parcelas : this.pedido.pagamentos[2].parcelas
		}
	}

	parcelas = [
		{ value: 1, viewValue: '1x' },
		{ value: 2, viewValue: '2x' },
		{ value: 3, viewValue: '3x' },
		{ value: 4, viewValue: '4x' },
		{ value: 5, viewValue: '5x' },
		{ value: 6, viewValue: '6x' },
		{ value: 7, viewValue: '7x' },
		{ value: 8, viewValue: '8x' },
		{ value: 9, viewValue: '9x' },
		{ value: 10, viewValue: '10x' }
	];

	constructor(
		private _formBuilder: FormBuilder,
		private tb: ToolbarBuilder,
		private produtoService: ProdutoService
	) { }

	ngOnInit() {

		this.firstFormGroup = this._formBuilder.group({});
		this.secondFormGroup = this._formBuilder.group({});
		this.thirdFormGroup = this._formBuilder.group({});

		this.frame = {
			title: 'Novo Pedido',
			toolbar: this.tb
				.withTitle({ description: 'Novo Pedido', icon: this.tb.icon('assignment').build() })
				.build()
		};

		this.produtoService.getProdutos().subscribe(produtos => this.produtos = produtos);
	}

	estoque(produto: Produto) {
		let i: PedidoItem[] = this.pedido.itens.filter(i => i.produtoId === produto.id);
		return i[0] ? produto.quantidade - i[0].qtd : produto.quantidade;
	}

	basket(produto: Produto) {
		let i: PedidoItem[] = this.pedido.itens.filter(i => i.produtoId === produto.id);
		return i[0] ? i[0].qtd : 0;
	}

	add(produto: Produto) {
		let i = this.pedido.itens.filter(i => i.produtoId === produto.id);
		if (i[0]) {
			i[0].qtd++;
		} else {
			this.pedido.itens.push(this.pipe(produto));
		}
		console.log("this.pedidos.iten", this.pedido.itens);
	}

	remove(produto: Produto) {
		let i = this.pedido.itens.filter(i => i.produtoId === produto.id);
		for (let p of i) {
			p.qtd <= 0 ? this.splice(p, this.pedido.itens) : p.qtd--;
		}
	}

	total(produto: Produto) {
		let i = this.pedido.itens.filter(i => i.produtoId === produto.id)[0];
		return this.valorTotal(i);
	}

	totalPagamentos() {
		let soma = 0;
		this.pedido.pagamentos.map(p => soma +=p.valor);
		return soma;
	}

	totalBasket() {
		let soma =0;
		this.pedido.itens.map(i=>soma += i.valor * i.qtd);
		return soma;
	}

	totalItens() {
		let soma = 0; 
		this.pedido.itens.map( i=> soma += i.qtd);
		return soma;
	}

	totalReceber() {
		return this.totalBasket() - this.totalPagamentos();
	}

	getPagamento( pagamento : string ){
		let soma = 0 ;
		this.pedido.pagamentos.map(p=>soma += p.especie === pagamento ? p.valor : 0);
		return soma;
	}

	private valorTotal(i: PedidoItem) {
		return i && i.qtd > 0 ? i.qtd * i.valor : 0;
	}


	private pipe(produto: Produto): PedidoItem {
		return {
			id: 0,
			produtoId: produto.id,
			descricao: produto.descritivo,
			qtd: 1,
			valor: produto.preco
		};
	}

	private splice(target, data: any[]) {
		var index = data.indexOf(target, 0);
		if (index > -1) {
			data.splice(index, 1);
		}
	}



}

