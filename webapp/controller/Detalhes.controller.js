sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "../model/configurations"
  ],
  function (Controller, UIComponent, History, JSONModel, MessageBox, configurations) {
    "use strict";
    let base = this;



    return Controller.extend(
      "br.com.fortlev.cadmaterialprod.cadmaterialprod.controller.Detalhes",
      {

        configurations: configurations,

        onInit: function (oEvent) {
          //this.getOwnerComponent().getModel("invoice").getData().Invoices[0]
          var oView = this.getView();
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter
            .getRoute("detalhes")
            .attachPatternMatched(this._onObjectMatched, this);

          var newModel = new JSONModel({
            save: true,
            engenharia: true,
            manufatura: false,
            logistica: false,
            comercial: false,
            fiscal: false,
            contabilidade: false,
            suprimentos: false,
          });
          oView.setModel(newModel, "global");

          var newModel1 = new JSONModel({
            save: true,
            engenharia: true,
            manufatura: false,
            logistica: false,
            comercial: false,
            fiscal: false,
            contabilidade: false,
            suprimentos: false,
          });
          oView.setModel(newModel1, "newModel");

          var add = new JSONModel({
            manufatura: false,
            logistica: false,
            comercial: false,
            contabildiade: false,
          })
          oView.setModel(add, "add");
        },

        _onObjectMatched: function (oEvent) {

          this.getView().bindElement({
            path:
              "/" +
              window.decodeURIComponent(oEvent.getParameter("arguments").id),
          });

          this.resetProps();

          var oView = this.getView();
          var oDataGeral =
            oView.getBindingContext().oModel.oData[
            oEvent.getParameter("arguments").id
            ];

          oDataGeral.Urgente = (oDataGeral.Urgente == 'X') ? true : false;
          oView.setModel(new JSONModel(oDataGeral), "geral");
          var oModel = oView.getBindingContext().oModel;

          switch (oDataGeral.Status) {
            case 'SUPRIMENTOS':
              var oDataContabilidade;
              oModel.read('/ContabilidadeSet', {
                urlParameters: {
                  "$filter": `IdProc eq ${oDataGeral.IdProc}`
                },
                success: function (data, response) {
                  oDataContabilidade = data;
                  oView.setModel(new JSONModel(oDataContabilidade), "contabilidade");

                  var newModel1 = new JSONModel({
                    save: true,
                    engenharia: true,
                    manufatura: true,
                    logistica: true,
                    comercial: true,
                    fiscal: true,
                    contabilidade: true,
                    suprimentos: true
                  });
                  oView.setModel(newModel1, "newModel");

                }.bind(this),
                error: function (response) {
                  MessageBox.error(JSON.parse(response.responseText).error.message.value, {})
                }.bind(this),
              });
            case 'CONTABILIDADE':
              var oDataFiscal;
              oModel.read('/FiscalSet', {
                urlParameters: {
                  "$filter": `IdProc eq ${oDataGeral.IdProc}`
                },
                success: function (data, response) {
                  oDataFiscal = data.results[0];
                  oView.setModel(new JSONModel(oDataFiscal), "fiscal");
                }.bind(this),
                error: function (response) {
                  MessageBox.error(JSON.parse(response.responseText).error.message.value, {})
                }.bind(this),
              });
              this.switchPropVisible('/contabilidade', true);

            case 'FISCAL':
              var oDataComercial;
              oModel.read('/ComercialSet', {
                urlParameters: {
                  "$filter": `IdProc eq ${oDataGeral.IdProc}`
                },
                success: function (data, response) {
                  oDataComercial = data;
                  oView.setModel(new JSONModel(oDataComercial), "comercial");
                }.bind(this),
                error: function (response) {
                  console.log(response);
                }.bind(this),
              });
              this.switchPropVisible('/fiscal', true);
            case 'COMERCIAL':
              var oDataLogistica;
              oModel.read('/LogisticaSet', {
                urlParameters: {
                  "$filter": `IdProc eq ${oDataGeral.IdProc}`
                },
                success: function (data, response) {
                  oDataLogistica = data;
                  oView.setModel(new JSONModel(oDataLogistica), "logistica");
                }.bind(this),
                error: function (response) {
                  console.log(response);
                }.bind(this),
              });
              this.switchPropVisible('/comercial', true);
            case 'LOGISTICA':
              var oDataManufatura;
              oModel.read('/ManufaturaSet', {
                urlParameters: {
                  "$filter": `IdProc eq ${oDataGeral.IdProc}`
                },
                success: function (data, response) {
                  oDataManufatura = data;
                  oView.setModel(new JSONModel(oDataManufatura), "manufatura");
                }.bind(this),
                error: function (response) {
                  console.log(response);
                }.bind(this),
              });
              this.switchPropVisible('/logistica', true);
            case 'MANUFATURA':
              var oDataEngenharia;
              oModel.read('/EngenhariaSet', {
                urlParameters: {
                  "$filter": `IdProc eq ${oDataGeral.IdProc}`
                },
                success: function (data, response) {
                  oDataEngenharia = data.results[0];
                  oDataEngenharia.Ean = (oDataEngenharia.Ean == 'X') ? true : false;
                  oDataEngenharia.Dun14 = (oDataEngenharia.Dun14 == 'X') ? true : false;
                  oDataEngenharia.Dun142 = (oDataEngenharia.Dun142 == 'X') ? true : false;
                  oDataEngenharia.VisaoQm = (oDataEngenharia.VisaoQm == 'X') ? true : false;
                  oDataEngenharia.LoteObrig = (oDataEngenharia.LoteObrig == 'X') ? true : false;
                  oView.setModel(new JSONModel(oDataEngenharia), "engenharia");
                }.bind(this),
                error: function (response) {
                  console.log(response);
                }.bind(this),
              });
              this.switchPropVisible('/manufatura', true);
              break;
          }

          switch (oDataGeral.Status) {
            case 'SUPRIMENTOS':
              break;
            case 'CONTABILIDADE':
              oView.setModel(new JSONModel({ results: [] }), "contabilidade");
              this.switchPropEditable('/contabilidade', true);
              this.switchPropButtonAdd('/contabilidade', true); break;
            case 'FISCAL':
              let oFisc = this.getOwnerComponent()
                .getModel()
                .createEntry("/FiscalSet");
              oView.setModel(new JSONModel(oFisc), "fiscal");
              this.switchPropEditable('/fiscal', true); break;
            case 'COMERCIAL':
              oView.setModel(new JSONModel({ results: [] }), "comercial");
              this.switchPropEditable('/comercial', true);
              this.switchPropButtonAdd('/comercial', true); break;
            case 'LOGISTICA':
              oView.setModel(new JSONModel({ results: [] }), "logistica");
              this.switchPropEditable('/logistica', true);
              this.switchPropButtonAdd('/logistica', true); break;
            case 'MANUFATURA':
              oView.setModel(new JSONModel({ results: [] }), "manufatura");
              this.switchPropEditable('/manufatura', true);
              this.switchPropButtonAdd('/manufatura', true); break;
          }

          //Tratativa de perfil
        },

        onNavBack: function () {
          var oHistory = History.getInstance();
          var sPrevHash = oHistory.getPreviousHash();

          if (sPrevHash !== undefined) {
            window.history.go(-1);
          } else {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("interno");
          }
        },

        _isValid: function (status) {
          // var obligModel = this.getOwnerComponent().getModel('obligModel').getData();
          debugger;
          var engenhariaDataModel = this.getView().getModel('engenharia').getData();
          var engenhariaObligModel = this.configurations.engenhariaModel;

          if (status == 'ENGENHARIA' || status == 'SUPRIMENTOS') {
            for (const key in engenhariaDataModel) {
              if (engenhariaObligModel[key] && !engenhariaDataModel[key]) {
                return false;  // Required field is missing
              }
            }
          }

          if (status == 'SUPRIMENTOS' || status == 'MANUFATURA') {
          var manufaturaDataModel = this.getView().getModel('manufatura').getData().results[0];
          var manufaturaObligModel = this.configurations.manufaturaModel;

          if (manufaturaDataModel == undefined){
            return false;  // Required field is missing
          }

          for (const key in manufaturaDataModel) {
            if (manufaturaObligModel[key] && !manufaturaDataModel[key]) {
              return false;  // Required field is missing
            }
          }
        }

          if (status == 'SUPRIMENTOS' || status == 'LOGISTICA') {
            var logisticaDataModel = this.getView().getModel('logistica').getData().results[0];
            var logisticaObligModel = this.configurations.logisticaModel;
            
            if (logisticaDataModel == undefined){
              return false;  // Required field is missing
            }

            for (const key in logisticaDataModel) {
              if (logisticaObligModel[key] && !logisticaDataModel[key]) {
                return false;  // Required field is missing
              }
            }

          }

          if (status == 'SUPRIMENTOS' || status == 'COMERCIAL') {
            var comercialDataModel = this.getView().getModel('comercial').getData().results[0];
            var comercialObligModel = this.configurations.comercialModel;

            if (comercialDataModel == undefined){
              return false;  // Required field is missing
            }

            for (const key in comercialDataModel) {
              if (comercialObligModel[key] && !comercialDataModel[key]) {
                return false;  // Required field is missing
              }
            }
          }

          if (status == 'SUPRIMENTOS' || status == 'FISCAL') {
            var fiscalDataModel = this.getView().getModel('fiscal').getData();
            var fiscalObligModel = this.configurations.fiscalModel;

            for (const key in fiscalDataModel) {
              if (fiscalObligModel[key] && !fiscalDataModel[key]) {
                return false;  // Required field is missing
              }
            }

          }

          if (status == 'SUPRIMENTOS' || status == 'CONTABILIDADE') {
            var contabilidadeDataModel = this.getView().getModel('contabilidade').getData().results[0];
            var contabilidadeObligModel = this.configurations.contabilidadeModel;

            if (contabilidadeDataModel == undefined){
              return false;  // Required field is missing
            }

            for (const key in contabilidadeDataModel) {
              if (contabilidadeObligModel[key] && !contabilidadeDataModel[key]) {
                return false;  // Required field is missing
              }
            }
          }


          return true;  // All required fields are present
        },

        savePress: function () {
          var oView = this.getView();
          var oDataGeral = oView.getModel("geral").oData;
          var oRouter = UIComponent.getRouterFor(this);
          var that = this;

          if (!that._isValid(oDataGeral.Status)) {
            MessageBox.error("Algunos de los campos que se encuentran vacios son obligatorios", {})
            return;
          }

          MessageBox.confirm("Deseja salvar o ajuste da Informação?", {
            title: "Alteração de Cadastro",
            onClose: function (oAction) {
              if (oAction == "OK") {

                switch (oDataGeral.Status) {
                  case 'SUPRIMENTOS':

                    that._saveAll(oDataGeral.IdProc);

                    break;
                  case 'CONTABILIDADE':
                    var oDataContabilidade = that.getView().getModel("contabilidade").oData;
                    var oModel = that.getView().getModel()
                    var oData = {
                      d: {}
                    };

                    oData.d.IdProc = oDataGeral.IdProc;
                    oData.d.CodMaterial = oDataGeral.CodMaterial;
                    oData.d.ClasseAvaliacao = oDataContabilidade.results[0].ClasseAvaliacao;
                    oData.d.CentroLucro = oDataContabilidade.results[0].CentroLucro;
                    oData.d.Centro = oDataContabilidade.results[0].Centro;
                    //oData.d.CodMaterial = oDataFiscal.CodMaterial;

                    delete oData.d.__metadata;

                    oModel.create("/ContabilidadeSet", oData, {
                      success: function (oData, response) {
                        console.log(response)
                        MessageBox.success("Cadastro atualizado com sucesso! Solicitação enviada para a próxima etapa", {
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
                        console.log(oError);
                      },
                    });

                    break;
                  case 'FISCAL':
                    var oModel = oView.getModel()
                    var oDataFiscal = oView.getModel("fiscal").oData;
                    var oData = {
                      d: {}
                    };

                    // oData.d = oDataFiscal;
                    oData.d.IdProc = oDataGeral.IdProc;
                    oData.d.CodMaterial = oDataGeral.CodMaterial;
                    oData.d.Ncm = oDataFiscal.Ncm;
                    oData.d.HierarquiaProd = oDataFiscal.HierarquiaProd;
                    //oData.d.CodMaterial = oDataFiscal.CodMaterial;

                    delete oData.d.__metadata;

                    oModel.create("/FiscalSet", oData, {
                      success: function (oData, response) {
                        console.log(response)
                        MessageBox.success("Cadastro atualizado com sucesso! Solicitação enviada para a próxima etapa", {
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
                        console.log(oError);
                      },
                    });

                    break;
                  case 'COMERCIAL':
                    var oDataComercial = oView.getModel("comercial").oData;
                    var oDataCall = [];

                    for (let i = 0; i < oDataComercial.results.length; i++) {
                      var oData = {
                        d: {}
                      };
                      const row = oDataComercial.results[i];
                      var oModel = oView.getModel()

                      oData.d = row;
                      oData.d.IdProc = oDataGeral.IdProc;
                      oData.d.CodMaterial = oDataGeral.CodMaterial;
                      delete oData.d.__metadata;

                      oModel.setUseBatch(true);
                      oModel.setDeferredGroups(['com']);

                      var parameters = {
                        groupId: 'com',
                        success: function (oData, response) {
                          console.log(response)

                        },
                        error: function (oError) {
                          console.log(oError);
                        },
                      }

                      oDataCall.push(oData);
                      oModel.create("/ComercialSet", oDataCall[i].d, parameters);
                    }

                    oModel.submitChanges(parameters);

                    MessageBox.success("Cadastro atualizado com sucesso! Solicitação enviada para a próxima etapa", {
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
                    break;
                  case 'LOGISTICA':
                    var oDataLogistica = oView.getModel("logistica").oData;
                    var oDataCall = [];

                    for (let i = 0; i < oDataLogistica.results.length; i++) {
                      var oData = {
                        d: {}
                      };
                      const row = oDataLogistica.results[i];
                      var oModel = oView.getModel()

                      oData.d = row;
                      oData.d.IdProc = oDataGeral.IdProc;
                      oData.d.CodMaterial = oDataGeral.CodMaterial;
                      delete oData.d.__metadata;

                      oModel.setUseBatch(true);
                      oModel.setDeferredGroups(['logi']);

                      var parameters = {
                        groupId: 'logi',
                        success: function (oData, response) {
                          console.log(response)

                        },
                        error: function (oError) {
                          console.log(oError);
                        },
                      }

                      oDataCall.push(oData);
                      oModel.create("/LogisticaSet", oDataCall[i], parameters);
                    }

                    oModel.submitChanges(parameters);

                    MessageBox.success("Cadastro atualizado com sucesso! Solicitação enviada para a próxima etapa", {
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
                    break;
                  case 'MANUFATURA':
                    var oDataManufatura = oView.getModel("manufatura").oData;
                    var oDataCall = [];

                    for (let i = 0; i < oDataManufatura.results.length; i++) {
                      var oData = {
                        d: {}
                      };
                      const row = oDataManufatura.results[i];
                      var oModel = oView.getModel()

                      oData.d = row;
                      oData.d.IdProc = oDataGeral.IdProc;
                      oData.d.CodMaterial = oDataGeral.CodMaterial;
                      delete oData.d.__metadata;

                      oModel.setUseBatch(true);
                      oModel.setDeferredGroups(['man']);

                      var parameters = {
                        groupId: 'man',
                        success: function (oData, response) {
                          console.log(response)

                        },
                        error: function (oError) {
                          console.log(oError);
                        },
                      }

                      oDataCall.push(oData);
                      oModel.create("/ManufaturaSet", oDataCall[i].d, parameters);
                    }

                    oModel.submitChanges(parameters);

                    MessageBox.success("Cadastro atualizado com sucesso! Solicitação enviada para a próxima etapa", {
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
                    break;
                }
              }
            }
          });
        },

        cancPress: function () {
          var oView = this.getView();
          var oRouter = UIComponent.getRouterFor(this);

          oRouter.navTo("interno");
        },

        _saveAll: function (IdProc) {
          var that = this;
          var oModel = this.getView().getModel()
          var oView = this.getView();
          // var oDataGeral = oView.getBindingContext().oModel.oData[IdProc];
          // var oDataSuprimentos = oView.getModel("suprimentos").oData;
          var oDataGeral = oView.getModel("geral").oData;
          var oDataContabilidade = oView.getModel("contabilidade").oData.results[0];
          var oDataFiscal = oView.getModel("fiscal").oData;
          var oDataComercial = oView.getModel("comercial").oData.results[0];
          var oDataManufatura = oView.getModel("manufatura").oData.results[0];
          var oDataLogistica = oView.getModel("logistica").oData.results[0];


          var sPathContabilidade = this.getView().getModel().createKey("/ContabilidadeSet", {
            IdProc: oDataGeral.IdProc,
            CodMaterial: oDataGeral.CodMaterial,
            Centro: oDataContabilidade.Centro
          })
          var sPathFiscal = this.getView().getModel().createKey("/FiscalSet", {
            IdProc: oDataGeral.IdProc,
            CodMaterial: oDataGeral.CodMaterial
          })
          var sPathComercial = this.getView().getModel().createKey("/ComercialSet", {
            IdProc: oDataGeral.IdProc,
            CodMaterial: oDataGeral.CodMaterial,
            GrupoComiss: oDataComercial.GrupoComiss
          })
          var sPathManufatura = this.getView().getModel().createKey("/ManufaturaSet", {
            IdProc: oDataGeral.IdProc,
            CodMaterial: oDataGeral.CodMaterial,
            CentroProd: oDataManufatura.CentroProd
          })
          var sPathLogistica = this.getView().getModel().createKey("/LogisticaSet", {
            IdProc: oDataGeral.IdProc,
            CodMaterial: oDataGeral.CodMaterial,
            Centro: oDataLogistica.Centro
          })

          debugger;
          delete oDataContabilidade.__metadata;
          delete oDataFiscal.__metadata;
          delete oDataComercial.__metadata;
          delete oDataManufatura.__metadata;
          delete oDataLogistica.__metadata;
          // Update entities sequentially
          this.updateEntity(sPathContabilidade, oDataContabilidade)
            .then(function () {
              // First entity update successful, proceed to update the next entity
              return that.updateEntity(sPathFiscal, oDataFiscal);
            })
            .then(function () {
              // Second entity update successful, proceed to update the next entity
              return that.updateEntity(sPathComercial, oDataComercial);
            })
            .then(function () {
              // Continue updating other entities in a similar manner
              return that.updateEntity(sPathManufatura, oDataManufatura);
            })
            .then(function () {
              return that.updateEntity(sPathLogistica, oDataLogistica);
            })
            .catch(function (error) {
              // Handle errors for any of the update operations
              console.error('Error updating entity:', error);
            });


        },

        updateEntity: function (entityPath, entityData) {
          return new Promise(function (resolve, reject) {
            this.getView().getModel().update(entityPath, entityData, {
              success: function () {
                resolve();  // Resolve the promise if update is successful
              },
              error: function (error) {
                reject(error);  // Reject the promise if there's an error
              }
            });
          }.bind(this));
        },

        onBindingChangeContabilidade: function (oEvent) {
          this.getView()
            .byId("contabilidadeTab")
            .setVisibleRowCount(oEvent.getSource().getLength());
        },
        onBindingChangeManufatura: function (oEvent) {
          this.getView()
            .byId("manufaturaTab")
            .setVisibleRowCount(oEvent.getSource().getLength());
        },
        onBindingChangeLogistica: function (oEvent) {
          this.getView()
            .byId("logisticaTab")
            .setVisibleRowCount(oEvent.getSource().getLength());
        },
        onBindingChangeComercial: function (oEvent) {
          this.getView()
            .byId("comercialTab")
            .setVisibleRowCount(oEvent.getSource().getLength());
        },

        switchPropEditable: function (prop, bool) {
          var oView = this.getView();

          oView.getModel("newModel").setProperty(prop, bool);
        },

        switchPropVisible: function (prop, bool) {
          var oView = this.getView();

          oView.getModel("global").setProperty(prop, bool);
        },

        switchPropButtonAdd: function (prop, bool) {
          var oView = this.getView();

          oView.getModel("add").setProperty(prop, bool);
        },

        resetProps: function () {
          var oView = this.getView();

          oView.getModel("global").setProperty('/save', true);
          oView.getModel("global").setProperty('/engenharia', true);
          oView.getModel("global").setProperty('/manufatura', false);
          oView.getModel("global").setProperty('/logistica', false);
          oView.getModel("global").setProperty('/comercial', false);
          oView.getModel("global").setProperty('/fiscal', false);
          oView.getModel("global").setProperty('/contabilidade', false);
          oView.getModel("global").setProperty('/suprimentos', false);

          oView.getModel("newModel").setProperty('/save', true);
          oView.getModel("newModel").setProperty('/engenharia', true);
          oView.getModel("newModel").setProperty('/manufatura', false);
          oView.getModel("newModel").setProperty('/logistica', false);
          oView.getModel("newModel").setProperty('/comercial', false);
          oView.getModel("newModel").setProperty('/fiscal', false);
          oView.getModel("newModel").setProperty('/contabilidade', false);
          oView.getModel("newModel").setProperty('/suprimentos', false);

          oView.getModel("add").setProperty('/manufatura', false);
          oView.getModel("add").setProperty('/logistica', false);
          oView.getModel("add").setProperty('/comercial', false);
          oView.getModel("add").setProperty('/contabilidade', false);
        },

        onPressAddContabilidade: function () {
          var oModel = this.getView().getModel("contabilidade")

          let oCad = this.getOwnerComponent()
            .getModel()
            .createEntry("/ContabilidadeSet");
          let oCadJson = new JSONModel(oCad)
          // debugger;
          var oObject = oCadJson.oData.getObject();
          // oObject.CodMaterial = '1111';

          oModel.oData.results.push(oObject);
          oModel.refresh();
        },

        onPressAddComercial: function () {
          var oModel = this.getView().getModel("comercial")

          let oCad = this.getOwnerComponent()
            .getModel()
            .createEntry("/ComercialSet");
          let oCadJson = new JSONModel(oCad)

          oModel.oData.results.push(oCadJson.oData.getObject());
          oModel.refresh();
        },

        onPressAddLogistica: function () {
          var oModel = this.getView().getModel("logistica")
          var oDataManufatura = this.getView().getModel("manufatura").oData.results;
          for (let i = 0; i < oDataManufatura.length; i++) {
            const row = oDataManufatura[i];

            let oCad = this.getOwnerComponent()
              .getModel()
              .createEntry("/LogisticaSet");
            let oCadJson = new JSONModel(oCad)
            let oCadObj = oCadJson.oData.getObject();

            oCadObj.Centro = row.CentroProd;
            oModel.oData.results.push(oCadObj);
            oModel.refresh();
          }

          this.switchPropButtonAdd('/logistica', false);
        },

        onPressAddManufatura: function () {
          var oModel = this.getView().getModel("manufatura")

          let oCad = this.getOwnerComponent()
            .getModel()
            .createEntry("/ManufaturaSet");
          let oCadJson = new JSONModel(oCad)

          oModel.oData.results.push(oCadJson.oData.getObject());
          oModel.refresh();
        },

        onAccept: function () {
          MessageBox.confirm("Você quer aprovar?", {
            title: "Alteração de Cadastro",
            onClose: function (oAction) {
              console.log('Aprobando...');
            }
          })
        },
        onReject: function () {
          MessageBox.confirm("Você quer rejeitar?", {
            title: "Alteração de Cadastro",
            onClose: function (oAction) {
              console.log('Rechazando...');
            }
          })
        },

        onMenuAction: function (oEvent) {
          // var oModel = this.getView().getModel();
          var oModel = this.getView().getBindingContext().oModel;
          var vStatus = oEvent.getParameter('item').getProperty('text');
          var oDataGeral = this.getView().getModel("geral").oData;

          oModel.callFunction(
            "/cambiarStatus", {
            method: "POST",
            urlParameters: {
              IdProc: oDataGeral.IdProc,
              Status: vStatus,
              CodMaterial: oDataGeral.CodMaterial
            },
            success: function (oData, response) {
              debugger;
            },
            error: function (oError) {

            }
          });


        }
      }
    );
  }
);
