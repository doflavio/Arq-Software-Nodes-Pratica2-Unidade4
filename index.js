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
    if(msg.indexOf(" + ") > -1) return "+";
    if(msg.indexOf(" - ") > -1) return "-";
    if(msg.indexOf(" * ") > -1) return "*";
    if(msg.indexOf(" / ") > -1) return "/";
    throw `Operacao inválida. Não foi possível encontrar o operador`;
}

function valoresInformados(msg,operador){
    try {
        const msgSplit = msg.split(operador);
        
        var v1 = msgSplit[0];
        var v2 = msgSplit[1];
        if (isNaN(v1)) throw `valor de entrada inválido -> ${v1}`;
        if (isNaN(v2)) throw `valor de entrada inválido -> ${v2}`;
        v1 = parseFloat(msgSplit[0]);
        v2 = parseFloat(msgSplit[1]);
        const valores = [v1,v2];
        return valores;
    } catch (e) {
        throw `Erro de operação: ${e}`;
    }
}

// Função responsável por manusear a conexão websocket
wss.on("connection", (ws) => {
  // Função que trata as mensagens recebidas pelo servidor
  ws.on("message", (msg) => {
        console.log("Mensagem recebida: ", msg);
        
        try {
            
            const operacao = operacaoInformada(msg); 
            const valores = valoresInformados(msg,operacao);
            const numero1 = parseFloat(valores[0]);
            const numero2 = parseFloat( valores[1]);
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