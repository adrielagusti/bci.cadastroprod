sap.ui.define(
    [
        "jquery.sap.global",
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageToast",
        "sap/ui/model/Filter",
        "sap/ui/model/Sorter",
        "sap/ui/model/FilterOperator",
        "sap/ui/core/routing/History",
        "sap/ui/export/library",
        "sap/ui/export/Spreadsheet",
        "sap/ui/table/RowAction",
        "sap/ui/table/RowActionItem",
        "sap/ui/core/UIComponent",
        "sap/m/MessageBox",
    ],
    function (
        jQuery,
        Controller,
        JSONModel,
        MessageToast,
        Filter,
        Sorter,
        FilterOperator,
        History,
        exportLibrary,
        Spreadsheet,
        RowAction,
        RowActionItem,
        UIComponent,
        MessageBox
    ) {
        "use strict";
    
        return Controller.extend(
        "br.com.fortlev.cadmaterialprod.cadmaterialprod.controller.Cadastro",
        {
            onInit: function (oEvent) {
                var newModel1 = new JSONModel({
                    conf: false,
                    save: true,
                    editable: true,
                });
                this.getView().setModel(newModel1, "newModel");

                this.getOwnerComponent()
                    .getModel()
                    .metadataLoaded()
                    .then((event) => {
                    let oCad = this.getOwnerComponent()
                        .getModel()
                        .createEntry("/EngenhariaSet");

                    this.getView().setModel(new JSONModel(oCad), "cad");
                    });
            },
            onNavBack: function () {
                var oView = this.getView();
                if (!oView.getModel("newModel").getProperty("/save")) {
                    this.switchProp(true);
                } else {
                    var oHistory = History.getInstance();
                    var sPrevHash = oHistory.getPreviousHash();
      
                    if (sPrevHash !== undefined) {
                        window.history.go(-1);
                    } else {
                        var oRouter = UIComponent.getRouterFor(this);
                        oRouter.navTo("interno");
                    }
                }
            },

            savePress: function () {
                this.switchProp(false);
            },
      
            cancPress: function () {
                this.switchProp(true);
            },
      
            confPress: function () {
                var oView = this.getView();
                var oCad = oView.getModel("cad");
                var oData = {
                    d: oView.getModel("cad").oData.getObject(),
                };
                var oRouter = UIComponent.getRouterFor(this);

                MessageBox.confirm("Deseja confirmar o envio da Solicitação?", {
                    title: "Confirmação de Cadastro",
                    onClose: function (oAction) {
                        if (oAction == "OK") {
                            delete oData.d.__metadata;
            
                            //Binding
                            oData.d.CodMaterial = oCad.getProperty("/CodMaterial");
                            oData.d.Descricao = oCad.getProperty("/Descricao");
                            oData.d.DescricaoLonga = oCad.getProperty("/DescricaoLonga");
                            oData.d.TipoMaterial = oCad.getProperty("/TipoMaterial");
                            oData.d.MateriaPrima = oCad.getProperty("/MateriaPrima");
                            oData.d.CentroProd = oCad.getProperty("/CentroProd");
                            oData.d.ProcessoProd = oCad.getProperty("/ProcessoProd");
                            oData.d.UnidMedida = oCad.getProperty("/UnidMedida");
                            oData.d.PesoLiquido = oCad.getProperty("/PesoLiquido");
                            oData.d.PesoBruto = oCad.getProperty("/PesoBruto");
                            oData.d.UnidPeso = oCad.getProperty("/UnidPeso");
                            oData.d.Volume = oCad.getProperty("/Volume");
                            oData.d.UnidVolume = oCad.getProperty("/UnidVolume");
                            oData.d.Ean = oCad.getProperty("/Ean")?'X':'';
                            oData.d.Dun14 = oCad.getProperty("/Dun14")?'X':'';
                            oData.d.VisaoQm = oCad.getProperty("/VisaoQm")?'X':'';
                            oData.d.CtgsIMaterial = oCad.getProperty("/CtgsIMaterial");
                            oData.d.Dun142 = oCad.getProperty("/Dun142")?'X':'';
                            oData.d.FinalidadeProd = oCad.getProperty("/FinalidadeProd");
                            oData.d.LoteObrig = oCad.getProperty("/LoteObrig")?'X':'';
                            oData.d.Urgente = oCad.getProperty("/Urgente")?'X':'';
            
                            //Create
                            oView.getModel().create("/EngenhariaSet", oData, {
                                success: function (oData, response) {
                                    //oData -  contains the data of the newly created entry
                                    //response -  parameter contains information about the response of the request (this may be your message)
                
                                    MessageBox.success("Solicitação registrada com sucesso!", {
                                    onClose: function (oAction) {
                                        var oHistory = History.getInstance();
                                        var sPrevHash = oHistory.getPreviousHash();
                
                                        if (sPrevHash !== undefined) {
                                            window.history.go(-1);
                                        } else {
                                            oRouter.navTo("interno");
                                        }
                                    },
                                    });
                                },
                
                                error: function (oError) {
                                    //oError - contains additional error information.
                                    MessageBox.error(
                                    "Ocorreu um erro ao registrar a Solicitação. Tente novamente mais tarde!"
                                    );
                                },
                            });
                        }
                    },
                });
            },
      
            switchProp: function (bool) {
                var oView = this.getView();
        
                oView.getModel("newModel").setProperty("/save", bool);
                oView.getModel("newModel").setProperty("/conf", !bool);
                oView.getModel("newModel").setProperty("/editable", bool);
            },
        }
        );
    }
    );