const { historicoIPCA } = require('../dados/dados');

function buscarHistoricoIPCA() {
    return historicoIPCA;
}

function buscarIPCAPorAno(ano) {
    const anoHistoricoIPCA = parseInt(ano);
    return historicoIPCA.filter(anoipca => anoipca.ano === anoHistoricoIPCA);
}

function buscarIPCAPorId(id) {
    const idHistoricoIPCA = parseInt(id);
    return historicoIPCA.find(idipca => idipca.id === idHistoricoIPCA);
}

function calcularReajuste(valor, dataInicialMes, dataInicialAno, dataFinalMes, dataFinalAno) {  
    const historicoFiltrado = historicoIPCA.filter(historico => {  
        if(dataInicialAno === dataFinalAno) {  
            return historico.ano === dataInicialAno && historico.mes >= dataInicialMes && historico.mes <= dataFinalMes; 
        } else {  //Condições para anos diferentes
            return (
                (historico.ano === dataInicialAno && historico.mes >= dataInicialMes) ||  
                (historico.ano > dataInicialAno && historico.ano < dataFinalAno) ||  
                (historico.ano === dataFinalAno && historico.mes <= dataFinalMes)  
            )
        }
    })

    let taxasMensais = 1;
    for(const elemento of historicoFiltrado) {
        taxasMensais *= (elemento.ipca / 100) + 1;
    }  /*A função itera sobre os registros filtrados do IPCA e calcula a taxa mensal de reajuste acumulativa, 
       multiplicando os valores do IPCA de cada mês. A cada iteração, o valor de `taxasMensais` é atualizado multiplicando-se o valor anterior 
       pelo fator de aumento correspondente ao IPCA daquele mês. */

    const resultado = valor * taxasMensais;  //Multiplicação do `valor inicial` pelo valor acumulado das taxas mensais de reajuste
    return parseFloat(resultado.toFixed(2));  //Valor arredondado para duas casas decimais e retornado.
}

function validacaoErro(valor, dataInicialMes, dataInicialAno, dataFinalMes, dataFinalAno) {  
    const anoLimiteFinal = historicoIPCA[historicoIPCA.length - 1].ano;  
    const anoLimiteInicial = historicoIPCA[0].ano; 
    const mesLimiteFinal = historicoIPCA[historicoIPCA.length - 1].mes;  
    if(
        isNaN(valor) ||  //Verifica se os parâmetros são números
        isNaN(dataInicialMes) ||
        isNaN(dataInicialAno) ||
        isNaN(dataFinalMes) ||
        isNaN(dataFinalAno) ||
        dataInicialMes < 1 || dataInicialMes > 12 ||  
        dataInicialAno < anoLimiteInicial || dataInicialAno > anoLimiteFinal ||  
        dataFinalMes < 1 || dataFinalMes > 12 ||  
        dataFinalAno < anoLimiteInicial || dataFinalAno > anoLimiteFinal ||  
        (dataFinalAno === anoLimiteFinal && dataFinalMes > mesLimiteFinal) ||  
        dataFinalAno < dataInicialAno ||  
        (dataFinalAno == dataInicialAno && dataFinalMes < dataInicialMes)  
    ) {
        return true; 
    } else {
        return false; 
    }
};

exports.buscarHistoricoIPCA = buscarHistoricoIPCA;
exports.buscarIPCAPorAno = buscarIPCAPorAno;
exports.buscarIPCAPorId = buscarIPCAPorId;
exports.calcularReajuste = calcularReajuste;
exports.validacaoErro = validacaoErro;
