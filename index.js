// index.js
const { readFileSync } = require('fs');

// --- Classe Repositório ---
class Repositorio {
  constructor() {
    this.pecas = JSON.parse(readFileSync('./pecas.json'));
  }

  getPeca(apre) {
    return this.pecas[apre.id];
  }
}

// --- Classe de Serviço de Cálculo de Fatura ---
class ServicoCalculoFatura {
  constructor(repo) {
    this.repo = repo;
  }

  calcularCredito(apre) {
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if (this.repo.getPeca(apre).tipo === "comedia") {
      creditos += Math.floor(apre.audiencia / 5);
    }
    return creditos;
  }

  calcularTotalCreditos(apresentacoes) {
    return apresentacoes.reduce(
      (acc, apre) => acc + this.calcularCredito(apre),
      0
    );
  }

  calcularTotalApresentacao(apre) {
    let total = 0;
    const peca = this.repo.getPeca(apre);
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

  calcularTotalFatura(apresentacoes) {
    return apresentacoes.reduce(
      (acc, apre) => acc + this.calcularTotalApresentacao(apre),
      0
    );
  }
}

// --- Função utilitária de formatação ---
function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2
  }).format(valor / 100);
}

// --- Geração de fatura em texto ---
function gerarFaturaStr(fatura, calc) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;

  for (let apre of fatura.apresentacoes) {
    const peca = calc.repo.getPeca(apre);
    const total = calc.calcularTotalApresentacao(apre);
    faturaStr += `  ${peca.nome}: ${formatarMoeda(total)} (${apre.audiencia} assentos)\n`;
  }

  const totalFatura  = calc.calcularTotalFatura(fatura.apresentacoes);
  const totalCreditos = calc.calcularTotalCreditos(fatura.apresentacoes);

  faturaStr += `Valor total: ${formatarMoeda(totalFatura)}\n`;
  faturaStr += `Créditos acumulados: ${totalCreditos} \n`;
  return faturaStr;
}

// --- Main ---
const faturas = JSON.parse(readFileSync('./faturas.json'));
const repo    = new Repositorio();
const calc    = new ServicoCalculoFatura(repo);

console.log(gerarFaturaStr(faturas, calc));
