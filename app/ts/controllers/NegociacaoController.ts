import { Negociacao,Negociacoes } from '../models/index';
import { NegociacoesView,MensagemView } from '../views/index';
import {domInject} from '../helpers/decorators/index';

export class NegociacaoController{

    @domInject('#data')
    private _inputData: JQuery;

    @domInject('#quantidade')
    private _inputQuantidade: JQuery;

    @domInject('#valor')
    private _inputValor: JQuery;
    private _negociacoes = new Negociacoes();
    private _negociacoesView = new NegociacoesView('#negociacoesView');
    private _mensagemView = new MensagemView('#mensagemView');

    constructor() {

        // atualiza a view para exibir os dados do modelo, vazio
        this._negociacoesView.update(this._negociacoes);

    }

    adiciona(event: Event):void {

        event.preventDefault();

        let data = new Date(this._inputData.val().replace(/-/g,','));

        if (!this._ehDiaSemana(data)){
            this._mensagemView.update ('Não é possível realizar negociação nos finais de semana.');
            return;
        }

        const negociacao = new Negociacao(
            data,
            parseInt(this._inputQuantidade.val()),
            parseFloat(this._inputValor.val())
        );

        this._negociacoes.adiciona(negociacao);

        // depois de adicionar, atualiza a view novamente para refletir os dados
        this._negociacoesView.update(this._negociacoes);
        this._mensagemView.update('Negociação gravada com sucesso!');

    }

    private _ehDiaSemana(data : Date) {
        return data.getDay() != DiasDaSemana.Sabado && data.getDay() != DiasDaSemana.Domingo;
    }

    importaDados(){
        
        function isOk(res: Response){
            if(res.ok){
                return res;
            }
            else{
                throw new Error(res.statusText);
            }
        }

        fetch('http://localhost:8080/dados')
            .then(res => isOk(res))
            .then(res => res.json())
            .then((dados: any[]) => {
                dados
                    .map(dado => new Negociacao(new Date(), dado.vezes, dado.montante))
                    .forEach(negociacao => this._negociacoes.adiciona(negociacao))
                this._negociacoesView.update(this._negociacoes);
            })
            .catch(err => console.log(err.message));
    }
}

enum DiasDaSemana{
    Domingo,
    Segunda,
    Terca,
    Quarta,
    Quinta,
    Sexta,
    Sabado
}