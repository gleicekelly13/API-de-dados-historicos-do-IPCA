const express = require('express');
const app = express();

const { buscarHistoricoIPCA, buscarIPCAPorAno, buscarIPCAPorId, calcularReajuste, validacaoErro } = require('./servicos/servicos');

app.get('/historicoIPCA/calculo', (req, res) => {
    const valor = parseFloat(req.query.valor);
    const dataInicialMes = parseInt(req.query.mesInicial);
    const dataInicialAno = parseInt(req.query.anoInicial);
    const dataFinalMes = parseInt(req.query.mesFinal);
    const dataFinalAno = parseInt(req.query.anoFinal);

    if(validacaoErro(valor, dataInicialMes, dataInicialAno, dataFinalMes, dataFinalAno)) {
        res.status(400).json({erro : 'Parâmetros inválidos'});
        return;
    }

    const resultado = calcularReajuste(valor, dataInicialMes, dataInicialAno, dataFinalMes, dataFinalAno);

    res.json({resultado : resultado});
});

app.get('/historicoIPCA', (req, res) => {
    const anoIPCA = req.query.ano;
    if(anoIPCA) {
        const resultado = buscarIPCAPorAno(anoIPCA);
        if(resultado.length > 0) {
            res.json(resultado);
        } else {
            res.status(404).json({'erro' : 'Nenhum histórico encontrado para o ano especificado'});
        }
        
    }  else {
        res.json(buscarHistoricoIPCA());
    }
});

app.get('/historicoIPCA/:id', (req, res) => { 
    const idIPCA = parseInt(req.params.id);
    if(isNaN(idIPCA)) {  //Verificando se `idIPCA` é `NaN` antes de fazer qualquer outra verificação
        res.status(404).json({'erro' : 'ID inválido'});
    } else {
        const resultado = buscarIPCAPorId(idIPCA);
        if(resultado) {
            res.json(resultado);
        } else {
            res.status(404).json({'erro' : 'Elemento não encontrado'});
        }
    }
});

app.listen(8082, () => {
    console.log('Servidor iniciado na porta 8082');
});



