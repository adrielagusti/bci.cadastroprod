/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"brcomfortlevcadmaterialprod/cadmaterial_prod/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
