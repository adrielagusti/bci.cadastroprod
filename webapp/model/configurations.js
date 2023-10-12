sap.ui.define([], function () {
    "use strict";

    return {

        "engenhariaModel": {
            "Descricao": true,
            "DescricaoLonga": true,
            "TipoMaterial": true,
            "MateriaPrima": true,
            "CentroProd": true,
            "ProcessoProd": true,
            "UnidMedida": true,
            "PesoLiquido": true,
            "PesoBruto": true,
            "UnidPeso": true,
            "Volume": false,
            "UnidVolume": false,
            "Ean": true,
            "Dun14": true,
            "Dun142": true,
            "VisaoQm": true,
            "CtgsIMaterial": true,
            "FinalidadeProd": true,
            "LoteObrig": false
        },
        "manufaturaModel": {
            "CentroProd": true,
            "InstrProd": true,
            "TipoAvaliacao": true,
            "DepProd": true,
            "PerfilProduc": false,
            "VerifDisp": true,
            "DepSupExt": false
        },
        "logisticaModel": {
            "Centro": true,
            "AreaArmazemanento": true,
            "DepositEntrada": true,
            "DepositSaida": true,
            "Dun14": true,
            "Dun142": false,
            "Ean": true,
            "GFreteMerc": true,
            "TipoDeposito": true,
            "Volume": true,
            "UnidVolume": true
        },
        "comercialModel": {
            "GrupoComiss": true,
            "HierarquiaProd": true,
            "UmRemessa": true,
            "GrCatIt": true,
            "StatusMat": true,
            "OrgVendas": true,
            "CanalDist": true
        },
        "fiscalModel": {
            "Ncm": true,
            "HierarquiaProd": true,
            "CodMaterial": true,
            "MatCategoriaCFOP": true,
            "ClassifFiscalMat": true
        },

        "contabilidadeModel": {
            "Centro": true,
            "ClasseAvaliacao": true,
            "CentroLucro": true
          }
    };
});

