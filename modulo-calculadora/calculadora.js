function adicao(n1,n2){
    validarParametros(arguments);
    return n1 + n2;
}

function subtracao(n1,n2){
    return n1 - n2;
}

function multiplicacao(n1,n2){
    return n1 * n2;
}

function divisao(n1,n2){
    if(n2 === 0) return "Não é permitido divisao por zero";
    return n1 / n2;
}

function validarParametros(args){
    for (let i = 0; i < args.length; i++) {
        if (isNaN(args[i])) {
            throw `'${args[i]}' Não é um número !`;
        }
    }
}

module.exports = {
    somar:adicao,
    subtrair:subtracao,
    multiplicar:multiplicacao,
    dividir:divisao
}