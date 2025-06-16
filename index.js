// index.js
const { readFileSync } = require('fs');

// --- Classe de Serviço de Cálculo de Fatura ---
class ServicoCalculoFatura {
  calcularCredito(pecas, apre) {
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if (getPeca(pecas, apre).tipo === "comedia") {
      creditos += Math.floor(apre.audiencia / 5);
    }
    return creditos;
  }

  calcularTotalCreditos(pecas, apresentacoes) {
    return apresentacoes.reduce(
      (acc, apre) => acc + this.calcularCredito(pecas, apre),
      0
    );
  }

  calcularTotalApresentacao(pecas, apre) {
    let total = 0;
    const peca = getPeca(pecas, apre);
    switch (peca.tipo) {
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
        throw new Error(`Peça desconhecida: ${peca.tipo}`);
    }
    return total;
  }

  calcularTotalFatura(pecas, apresentacoes) {
    return apresentacoes.reduce(
      (acc, apre) => acc + this.calcularTotalApresentacao(pecas, apre),
      0
    );
  }
}

// --- Funções auxiliares externas ---

function getPeca(pecas, apre) {
  return pecas[apre.id];
}

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2
  }).format(valor / 100);
}

// --- Geração de fatura em texto simples ---

function gerarFaturaStr(fatura, pecas, calc) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;

  for (let apre of fatura.apresentacoes) {
    faturaStr += `  ${getPeca(pecas, apre).nome}: ${formatarMoeda(
      calc.calcularTotalApresentacao(pecas, apre)
    )} (${apre.audiencia} assentos)\n`;
  }

  faturaStr += `Valor total: ${formatarMoeda(
    calc.calcularTotalFatura(pecas, fatura.apresentacoes)
  )}\n`;
  faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(
    pecas,
    fatura.apresentacoes
  )} \n`;

  return faturaStr;
}

// --- Geração de fatura em HTML (comentado para esta etapa) ---

// function gerarFaturaHTML(fatura, pecas) { … }

// --- Main ---

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas    = JSON.parse(readFileSync('./pecas.json'));
const calc     = new ServicoCalculoFatura();

console.log(gerarFaturaStr(faturas, pecas, calc));
// console.log(gerarFaturaHTML(faturas, pecas)); // comentado
