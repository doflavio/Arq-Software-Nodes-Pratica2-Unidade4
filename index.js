const express = require('express');
const app = express();
const port = 3000;

const http = require('http');
const { parse } = require('url');
const webSocket = require('ws');

const calcular = require('./modulo-calculadora/calculadora');

//Inicializa um servidor HTTP orquestrado pelo express
const server = http.createServer(app);

//Inicializa um instancia de servidor websocket a partir do servidor http
const wss = new webSocket.Server({ server });

function operacaoInformada(msg){
    if(msg.indexOf("+") > -1) return "+";
    if(msg.indexOf("-") > -1) return "-";
    if(msg.indexOf("*") > -1) return "*";
    if(msg.indexOf("/") > -1) return "/";
    throw `Operacao inválida. Não foi possível encontrar o operador`;
}

function valoresInformados(msg,operador){
    try {
        const msgSplit = msg.split(operador);
        const v1 = parseFloat(msgSplit[0]);
        const v2 = parseFloat(msgSplit[1]);
        const valores = [v1,v2];
        return valores;
    } catch (error) {
        throw `Não foi possível realizar a operação, não é só de números`;
    }
}


// Função responsável por manusear a conexão websocket
wss.on("connection", (ws) => {
  // Função que trata as mensagens recebidas pelo servidor
  ws.on("message", (msg) => {
        console.log("Mensagem recebida: ", msg);
        
        try {
        /*    
        const operacao2 = operacaoInformada(msg); 
        console.log("operação 2: " + operacao2);
        const valores = valoresInformados(msg,operacao2);
        console.log("Valores: " + valores[0] + " - " + valores[1]);
        */
    
        const messageSplit = msg.split(' ');
        const numero1 = parseFloat(messageSplit[0]);
        const operacao = messageSplit[1];
        const numero2 = parseFloat( messageSplit[2]);
        var resultado = 0;
        switch(operacao) {
            case '+':
                resultado = calcular.somar(numero1,numero2);
                console.log(resultado);
                break;
            case '-':
                resultado = calcular.subtrair(numero1,numero2);
                console.log(resultado);
                break;
            case '*':
                resultado = calcular.multiplicar(numero1,numero2);
                console.log(resultado);
                break;
            case '/':
                resultado = calcular.dividir(numero1,numero2);
                console.log(resultado);
                break;
            default:
                resultado = "Operação Inválida";
        }
            ws.send(resultado);

        }catch(e){
            ws.send(`${e}` );
        }
        
  });
});



app.use(express.static("./site"));

server.listen(port,()=> {
    console.log(`Servidor HTTP rodando. Para acessar http://localhost:${port}`);
});