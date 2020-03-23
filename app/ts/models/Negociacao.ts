export class Negociacao {

        // o underline (_) significa que essa propriedade não pode ser alterada fora das 
        //estruturas da classe, ou seja, seria 'private'. Já o typescript já existe a palavra 
        // reservada 'private'
        constructor(
            readonly data: Date, 
            readonly quantidade: number, 
            readonly valor:number){}

    get volume() : number{

        return this.quantidade*this.valor;
    }
}