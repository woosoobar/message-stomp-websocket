/**
 * 
 */

(function(){
	
	console.log("app module");
	
	//angular.module("oamApp", ["oamApp.jqGrid", "oamApp.controllers", "websokServiceModule" ]);
	angular.module("oamApp", 
			["jqGrid", "chart", "chat", "websokServiceModule"]);
	
	angular.module("jqGrid", []);
	angular.module("chart", []);
	angular.module("chat", []);
	angular.module("websokServiceModule", []);
	
	
})(angular);