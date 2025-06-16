// apresentacao.js
const { formatarMoeda } = require('./util.js');

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
  faturaStr += `Créditos acumulados: ${totalCreditos}`;
  return faturaStr;
}

module.exports = gerarFaturaStr;
