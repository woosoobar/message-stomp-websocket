/**
 * 
 */

(function(){

	angular.module("jqGrid")
	.controller("AlaramGridController", function($scope, websokService) {

		var id = 0;
		var subscriber = {};
		
		$scope.data = [];
		$scope.maxlength = 10;
		
		subscriber = websokService.subscribe("/topic/realtimeAlarm");
		
		subscriber.listener.promise.then(null, null, function(message) {
			//console.log("OamJqGridController receive");
	        showAlarm(message);
//	        
//	        if(id > 5){
//	        	websokService.unsubscribe(subscriber);
//	        }
//	        	
	    });
		
		function showAlarm(message) {

			// TODO 유니크한 ID를 정해서 넣도록 구성
          	var row = 
          		{ 	id: id++, 
          			system: message.system, 
          			upper: message.upper, 
          			lower: message.lower, 
          			item: message.item,  
          			grade: message.grade,  
          			time: message.timestamp,  
          			log: message.log 
          		};
          	
          	// data의 변경은 watch 영역 외에서 처리를 해야 한다.
          	if($scope.data.length > 0){
          		$scope.data.splice($scope.data.length - 1, 1);
          	}

          	$scope.data.push(row);
        }
		
		$scope.config = {
					datatype: "local",
					//data: mydata,
					height: 250,
					width: 900,
					colModel: [
		                  { label: 'ID', name: 'id', width: 75, hidden: true, key:true },
		                  { label: 'SYSTEM', name: 'system', width: 100 },
		                  { label: 'Upper', name: 'upper', width: 100  },
		                  { label: 'Lower', name: 'lower', width: 100  },
		                  { label: 'Item', name: 'item', width: 100 },
		                  { label: 'Grade', name: 'grade', width: 80, formatter: gradeFmatter },
		                  { label: 'Time', name: 'time', width: 150 },
		                  { label: 'Log', name: 'log', width: 400 }
		              ],
					viewrecords: true, // show the current page, data rang and total records on the toolbar
					caption: "Load jqGrid through Javascript Array",
					loadComplete: function(){},
					afterInsertRow: function(){},
					maxlength:10,
		          };
		
		// 향후 formatting 처리 시에 사용...
		function gradeFmatter (cellvalue, options, rowObject)
		{
			//console.log('gradeFmatter');
			// style 설정은 하지 못함. id의 값이 할당이 이후에 벌어지는 것으로 보여짐.
			return cellvalue;
		}

	})
	// directive 에서 받을 수 없는 인자는 $scope
	.directive('alaramGrid',['$document', function($document) {

		return {
			restrict: 'E',
			scope: {
				config : '=',
				data : '=',
			},
			link: function(scope, element, attrs){
				
				var table;
				var maxlength;
				
				function afterInsertRow (rowid, aData) {
					$(table).jqGrid('setCell', rowid, 'grade', '', getGradeCellStyle(aData.grade) );
				}
				
				function getGradeCellStyle(grade){
					var color = '';
					if(grade == 'CRITICAL'){
						color = 'red';
					} else if(grade == 'MAJOR'){
						color = '#ffa500';
					} else if (grade == 'MINOR'){
						color = '#e8e217';
					} else if (grade == 'NORMAL'){
						color = '#90ee90';
					}
					
					var style = { background: color, color: 'white', 'font-weight': 'bold' };
					return style;
				}
				
				//config attribute 값의 변경을 체크하여 반영한다.
				scope.$watch('config', function(newValue){
					
					element.children().empty();
					table = angular.element('<table></table>');
					element.append(table);					
					newValue.afterInsertRow = afterInsertRow;
					maxlength = newValue.maxlength;
					
					$(table).jqGrid(newValue);
				});
				

				// watch 내부에서 인자 값을 변경할 경우 문제가 에러가 발생함.
				// 예) newValue.splice(newValue.length - 1, 1);
				scope.$watchCollection('data', function(newValue, oldValue){
					
					// undefined 이면 내부적으로 row id 관리를 한다.					
					$(table).jqGrid('addRowData', undefined, newValue[newValue.length - 1], 'first');
					var rows = $(table).jqGrid('getRowData');
					if(rows.length > maxlength){
						$(table).jqGrid('delRowData', rows[rows.length - 1].id);
					}					
				});
			}
		};
	}])
	// =========================================================================
	// jqGrid는 virtical oriented column 형식이 지원이 안됌
	// 1. 동적 열 추가를 할 수 없어 기존 테이블을 지우고 다시 그려야함... 하지만 다시 그릴경우 스크롤이 맨 앞으로가..이것에 대한 처리를 해야함...
	// 2. Max 열을 만들고 데이터를 업데이트 시키는 방안으로 처리 하도록 구성
	
	.controller("realtimeStaticGridController", function($scope, websokService) {

		var id = 0;
		var subscriber = {};
		
		var config = {};
		
		var columnPrifix = 'value';
		var verticalHeader = 
			[
			 {item: 'cpuMax',},
			 {item: 'cpuAverage',  },
			 {item: 'ramMax', },
			 {item: 'ramAverage',},
			 {item: 'diskMax',},
			 {item: 'diskAverage',},
			 ];
		
		$scope.data = verticalHeader;
		$scope.maxlength = 20;
		$scope.currentPos = 0;
		
		subscriber = websokService.subscribe("/topic/resourceMonitor");
		
		subscriber.listener.promise.then(null, null, function(message) {
			//console.log("realtimeStaticGridController receive");
	        showAlarm(message);	
	    });

		// TODO 이름 변경 요망.
		function showAlarm(message) {
			
			var msgKeys = Object.keys(message);
			var columnName = columnPrifix + $scope.currentPos;
			
			if($scope.currentPos < $scope.maxlength){
				
				$("#mygrid").jqGrid('setLabel', columnName, message.timestamp);
				
				var rows= $("#mygrid").jqGrid('getRowData');
				for(var i = 0; i < rows.length; i++){
					var row = rows[i];
					row[columnName] = message[row.item];
					//console.log(row[columnName]);
					$("#mygrid").jqGrid('setRowData', row.item, row);
				}
				
				$scope.currentPos++;
			} 
			else {
				console.log('################################################');

				// label 처리 코드
				var columnNames = $("#mygrid").jqGrid('getGridParam','colNames');				
				for(var i = 1; i < columnNames.length - 1; i++){
					var index = i - 1;
					$("#mygrid").jqGrid('setLabel', columnPrifix + index, columnNames[i + 1]);
				}				
				$("#mygrid").jqGrid('setLabel', columnPrifix + ($scope.maxlength - 1), message.timestamp);
				
				
				// Content 처리 코드
				var columnLast = columnPrifix + ($scope.maxlength - 1);
				var rows= $("#mygrid").jqGrid('getRowData');
				for(var i = 0; i < rows.length; i++){					
					var row = rows[i];

					for(var j = 1; j <  $scope.maxlength; j++){
						var columnBefore = columnPrifix + (j - 1);
						var column = columnPrifix + j;
						//console.log(columnBefore);
						//console.log(column);		
						row[columnBefore] = row[column];
						$("#mygrid").jqGrid('setRowData', row.item, row);
					}
				}
				
				// 마지막 열에 데이터 입력
				for(var i = 0; i < rows.length; i++){
					var row = rows[i];
					row[columnLast] = message[row.item];
					//console.log(columnLast);
					$("#mygrid").jqGrid('setRowData', row.item, row);
				}
			}
			
			// TODO 실제 데이터 값이 유지 되는지 확인 요망.
        }
		
		// 열 설정 처리
		// TODO timestemp 변경 처리 요망....
		//config.colModel.push({ label: message.timestamp, name: index, width: 80, sortable: false, sorttype: "text"});
		
		// column setting
		var colModel = [];
		colModel.push({ label: 'ITEM', name: 'item', width: 80, frozen : true, key:true, sortable: false, });
		for(var i = 0; i < $scope.maxlength; i++){
			colModel.push({ label: ' ', name: columnPrifix + i, width: 120, sortable: false});
		}
		
		$scope.config = {
					datatype: "local",
					data: $scope.data,
					height: 250,
					width: 900,
					colModel: colModel,
					viewrecords: false, // show the current page, data rang and total records on the toolbar
					shrinkToFit: false,
					caption: "Realtime Static Grid",
					loadComplete: function(){},
					afterInsertRow: function(){},
					maxlength: $scope.maxlength,
					currentPos: $scope.currentPos,
		          };
		
		// 향후 formatting 처리 시에 사용...
		function gradeFmatter (cellvalue, options, rowObject)
		{
			//console.log('gradeFmatter');
			// style 설정은 하지 못함. id의 값이 할당이 이후에 벌어지는 것으로 보여짐.
			return cellvalue;
		}

	})
	// directive 에서 받을 수 없는 인자는 $scope
	.directive('realtimeStaticGrid',['$document', function($document) {
		console.log("realtimeStaticGrid");
		return {
			restrict: 'E',
			scope: {
				config : '=',
				data : '=',
			},
			link: function(scope, element, attrs){
				
				console.log('scope');
				console.log(scope);
				
				var table;
				var maxlength = 0;
				var curruntPos = 0;
				
				function afterInsertRow (rowid, aData) {
					$(table).jqGrid('setCell', rowid, 'grade', '', getGradeCellStyle(aData.grade) );
				}
				
				function getGradeCellStyle(grade){
					var color = '';
					if(grade == 'CRITICAL'){
						color = 'red';
					} else if(grade == 'MAJOR'){
						color = '#ffa500';
					} else if (grade == 'MINOR'){
						color = '#e8e217';
					} else if (grade == 'NORMAL'){
						color = '#90ee90';
					}
					
					var style = { background: color, color: 'white', 'font-weight': 'bold' };
					return style;
				}
				
				//config attribute 값의 변경을 체크하여 반영한다.
				// 3 parameter : deep check
				// 초기값의 설정만 관리 하도록 한다. deep check 를 하지 않는다.
				scope.$watch(function(){return scope.config;}, function(newValue, oldValue){
					
					//console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
					
					element.children().empty();
					
					// TODO id를 관리 하는 내용 확인
					table = angular.element("<table id='mygrid'></table>");
					element.append(table);					
					//newValue.afterInsertRow = afterInsertRow;
					maxlength = newValue.maxlength;
					curruntPos = newValue.curruntPos;
					
					$(table).jqGrid(newValue);
					
//					$(table).jqGrid("destroyFrozenColumns")
//		            .jqGrid("setColProp", "item", { frozen: true })
//		            .jqGrid("setFrozenColumns")
//		            .trigger("reloadGrid", [{ current: true}]);
					
				});
				

				/*
				 // data를 컬럼 구성시에 다 넣어야 하는 상황임.....ㅜㅜ
				// watch 내부에서 인자 값을 변경할 경우 문제가 에러가 발생함.
				// 예) newValue.splice(newValue.length - 1, 1);
				scope.$watchCollection('data', function(newValue, oldValue){
					
					console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
					
					return;
					
					// undefined 이면 내부적으로 row id 관리를 한다.
					for(var i = 0; i < newValue.length; i++) {
						console.log(newValue[i]);
						$(table).jqGrid('addRowData', undefined, newValue[i], 'last');
					}
					
					// TODO 삭제는 전체 길이를 보고 처리
					
//					var rows = $(table).jqGrid('getRowData');
//					if(rows.length > maxlength){
//						$(table).jqGrid('delRowData', rows[rows.length - 1].id);
//					}					
				});
				*/
			}
		};
	}])
	; // angular.module("oamApp.jqGrid") end
	
})(angular);