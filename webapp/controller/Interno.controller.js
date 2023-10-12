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
    RowActionItem
) {
    "use strict";

    return Controller.extend(
    "br.com.fortlev.cadmaterialprod.cadmaterialprod.controller.Interno",
    {
        _oResponsivePopover: null,
        onInit: function (oEvent) {
        this.mode = undefined;
        var oView = this.getView();

        //Controles
        var newModel1 = new JSONModel({
            visibleHeader: true,
            filtro: false,
        });
        oView.setModel(newModel1, "newModel");

        //Actions Navigation
        var oTable = this.byId("tabelaProc");
        var fnPress = this.onClick.bind(this);
        var oTemplate = new RowAction({
            items: [
            new RowActionItem({
                type: "Navigation",
                press: fnPress,
                visible: "{Available}",
            }),
            ],
        });
        oTable.setRowActionTemplate(oTemplate);
        oTable.setRowActionCount(1);
        },

        onClick: function (oEvent) {
        var oItem = oEvent.getSource();
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

        console.log(oItem);
        oRouter.navTo("detalhes", {
            id: window.encodeURIComponent(
            oItem.getBindingContext().getPath().substr(1)
            ),
        });
        },

        novoCadastro: function (oEvent) {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("cadastro");
        },

        filtrar: function (oEvent) {
        var oTable = this.byId("tabelaProc");

        var aColumns = oTable.getColumns();
        for (var i = 0; i < aColumns.length; i++) {
            oTable.filter(aColumns[i], null);
        }
        },

        atualizar: function (oEvent) {
        this.getView().getModel().refresh(true);
        },

        onNavBack: function () {
        /*
        var oHistory = History.getInstance();
        var sPrevHash = oHistory.getPreviousHash();

        if (sPrevHash !== undefined) {
        window.history.go(-1);
        } else {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("");
        }*/
        },

        exportUI: function () {
        var aCols, oRowBinding, oSettings, oSheet, oTable;

        if (!this._oTable) {
            this._oTable = this.byId("tabelaProc");
        }

        oTable = this._oTable;
        oRowBinding = oTable.getBinding("rows");
        aCols = this.createColumnConfig();

        oSettings = {
            workbook: {
            columns: aCols,
            hierarchyLevel: "Level",
            },
            dataSource: oRowBinding,
            fileName: "export.xlsx",
        };

        oSheet = new Spreadsheet(oSettings);
        oSheet.build().finally(function () {
            oSheet.destroy();
        });
        },

        createColumnConfig: function () {
        var aCols = [];

        aCols.push({
            label: "ID",
            property: "IdProc",
        });

        aCols.push({
            label: "Código do Material",
            property: "CodMaterial",
        });

        
        aCols.push({
            label: "Status",
            property: "Status",
        });

        aCols.push({
            label: "Data de Criação",
            property: "DtCriacao",
        });

        
        aCols.push({
            label: "Data de Modificação",
            property: "DtModificacao",
        });

        aCols.push({
            label: "Usuario",
            property: "Usuario",
        });

        return aCols;
        },

        onBindingChange: function (oEvent) {
        this.getView()
            .byId("tabelaProc")
            .setVisibleRowCount(oEvent.getSource().getLength());
        },
    }
    );
}
);