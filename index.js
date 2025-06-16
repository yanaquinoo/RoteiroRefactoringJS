// index.js
const { readFileSync } = require('fs');

function gerarFaturaStr(fatura, pecas) {
  // função query
  function getPeca(apre) {
    return pecas[apre.id];
  }

  // cálculo extraído sem parâmetro 'peca'
  function calcularTotalApresentacao(apre) {
    let total = 0;
    switch (getPeca(apre).tipo) {
      case "tragedia":
        total = 40000;
        if (apre.audiencia > 30) {
          total += 1000 * (apre.audiencia - 30);
        }
        break;
      case "comedia":
        total = 30000;
        if (apre.audiencia > 20) {
          total += 10000 + 500 * (apre.audiencia - 20);
        }
        total += 300 * apre.audiencia;
        break;
      default:
        throw new Error(`Peça desconhecida: ${getPeca(apre).tipo}`);
    }
    return total;
  }

  let totalFatura = 0;
  let creditos    = 0;
  let faturaStr   = `Fatura ${fatura.cliente}\n`;
  const formato   = new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL", minimumFractionDigits: 2
  }).format;

  for (let apre of fatura.apresentacoes) {
    // agora só chamamos com um parâmetro
    let total = calcularTotalApresentacao(apre);

    // créditos para próximas contratações
    creditos += Math.max(apre.audiencia - 30, 0);
    if (getPeca(apre).tipo === "comedia") {
      creditos += Math.floor(apre.audiencia / 5);
    }

    // montagem da linha da fatura
    faturaStr += `  ${getPeca(apre).nome}: ${formato(total/100)} (${apre.audiencia} assentos)\n`;
    totalFatura += total;
  }

  faturaStr += `Valor total: ${formato(totalFatura/100)}\n`;
  faturaStr += `Créditos acumulados: ${creditos} \n`;
  return faturaStr;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas    = JSON.parse(readFileSync('./pecas.json'));
console.log(gerarFaturaStr(faturas, pecas));
