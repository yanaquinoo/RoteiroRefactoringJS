// index.js
const { readFileSync } = require('fs');

// --- funções utilitárias e de cálculo já externas ---

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2
  }).format(valor / 100);
}

function getPeca(pecas, apre) {
  return pecas[apre.id];
}

function calcularTotalApresentacao(pecas, apre) {
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

function calcularCredito(pecas, apre) {
  let creditos = 0;
  creditos += Math.max(apre.audiencia - 30, 0);
  if (getPeca(pecas, apre).tipo === "comedia") {
    creditos += Math.floor(apre.audiencia / 5);
  }
  return creditos;
}

function calcularTotalFatura(pecas, apresentacoes) {
  return apresentacoes.reduce(
    (acc, apre) => acc + calcularTotalApresentacao(pecas, apre),
    0
  );
}

function calcularTotalCreditos(pecas, apresentacoes) {
  return apresentacoes.reduce(
    (acc, apre) => acc + calcularCredito(pecas, apre),
    0
  );
}

// --- geração de fatura em texto simples ---

function gerarFaturaStr(fatura, pecas) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;

  for (let apre of fatura.apresentacoes) {
    faturaStr += `  ${getPeca(pecas, apre).nome}: ${formatarMoeda(
      calcularTotalApresentacao(pecas, apre)
    )} (${apre.audiencia} assentos)\n`;
  }

  faturaStr += `Valor total: ${formatarMoeda(
    calcularTotalFatura(pecas, fatura.apresentacoes)
  )}\n`;
  faturaStr += `Créditos acumulados: ${calcularTotalCreditos(
    pecas,
    fatura.apresentacoes
  )} \n`;

  return faturaStr;
}

// --- nova: geração de fatura em HTML ---

function gerarFaturaHTML(fatura, pecas) {
  let html = `<html>\n`;
  html += `<p> Fatura ${fatura.cliente} </p>\n`;
  html += `<ul>\n`;
  for (let apre of fatura.apresentacoes) {
    html += `  <li> ${getPeca(pecas, apre).nome}: ${formatarMoeda(
      calcularTotalApresentacao(pecas, apre)
    )} (${apre.audiencia} assentos) </li>\n`;
  }
  html += `</ul>\n`;
  html += `<p> Valor total: ${formatarMoeda(
    calcularTotalFatura(pecas, fatura.apresentacoes)
  )} </p>\n`;
  html += `<p> Créditos acumulados: ${calcularTotalCreditos(
    pecas,
    fatura.apresentacoes
  )} </p>\n`;
  html += `</html>`;
  return html;
}

// --- main ---

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas    = JSON.parse(readFileSync('./pecas.json'));

console.log(gerarFaturaStr(faturas, pecas));
console.log('\n--- Fatura em HTML ---\n');
console.log(gerarFaturaHTML(faturas, pecas));
