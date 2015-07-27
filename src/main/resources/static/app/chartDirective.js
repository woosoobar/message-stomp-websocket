/**
 * 
 */

(function(){
	
	console.log("chart module");
	
	angular.module("chart")
	.controller("ResourceChartController3", function($scope, websokService) {

		console.log("ResourceChartController2");
		
		var chartLabel = [];
		var chartData = [];
		var data = [];
		var xSize = 6 * 5; // 1초당 (10초당)
		
		var subscriber = {};
		
		var chart = {};
		
		subscriber = websokService.subscribe("/topic/resourceMonitor");
		subscriber.listener.promise.then(null, null, function(message) {
			console.log("ResourceChartController receive");
			makeData(message);
	
	    });

		$scope.init = function () {
		    // check if there is query in url
		    // and fire search in case its value is not empty
			console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
			
			var defaultOptions = {
					  // Options for X-Axis
					  axisX: {
					    // The offset of the labels to the chart area
					    offset: 30,
					    // Position where labels are placed. Can be set to `start` or `end` where `start` is equivalent to left or top on vertical axis and `end` is equivalent to right or bottom on horizontal axis.
					    position: 'end',
					    // Allows you to correct label positioning on this axis by positive or negative x and y offset.
					    labelOffset: {
					      x: 0,
					      y: 0
					    },
					    // If labels should be shown or not
					    showLabel: true,
					    // If the axis grid should be drawn or not
					    showGrid: true,
					    // Interpolation function that allows you to intercept the value from the axis label
					    labelInterpolationFnc: Chartist.noop,
					    // Set the axis type to be used to project values on this axis. If not defined, Chartist.StepAxis will be used for the X-Axis, where the ticks option will be set to the labels in the data and the stretch option will be set to the global fullWidth option. This type can be changed to any axis constructor available (e.g. Chartist.FixedScaleAxis), where all axis options should be present here.
					    type: undefined
					  },
					  // Options for Y-Axis
					  axisY: {
					    // The offset of the labels to the chart area
					    offset: 40,
					    // Position where labels are placed. Can be set to `start` or `end` where `start` is equivalent to left or top on vertical axis and `end` is equivalent to right or bottom on horizontal axis.
					    position: 'start',
					    // Allows you to correct label positioning on this axis by positive or negative x and y offset.
					    labelOffset: {
					      x: 0,
					      y: 0
					    },
					    // If labels should be shown or not
					    showLabel: true,
					    // If the axis grid should be drawn or not
					    showGrid: true,
					    // Interpolation function that allows you to intercept the value from the axis label
					    labelInterpolationFnc: Chartist.noop,
					    // Set the axis type to be used to project values on this axis. If not defined, Chartist.AutoScaleAxis will be used for the Y-Axis, where the high and low options will be set to the global high and low options. This type can be changed to any axis constructor available (e.g. Chartist.FixedScaleAxis), where all axis options should be present here.
					    type: undefined,
					    // This value specifies the minimum height in pixel of the scale steps
					    scaleMinSpace: 50,
					    // Use only integer values (whole numbers) for the scale steps
					    onlyInteger: true
					  },
					  // Specify a fixed width for the chart as a string (i.e. '100px' or '50%')
					  width: undefined,
					  // Specify a fixed height for the chart as a string (i.e. '100px' or '50%')
					  height: '200px',
					  // If the line should be drawn or not
					  showLine: true,
					  // If dots should be drawn or not
					  showPoint: true,
					  // If the line chart should draw an area
					  showArea: false,
					  // The base for the area chart that will be used to close the area shape (is normally 0)
					  areaBase: 0,
					  // Specify if the lines should be smoothed. This value can be true or false where true will result in smoothing using the default smoothing interpolation function Chartist.Interpolation.cardinal and false results in Chartist.Interpolation.none. You can also choose other smoothing / interpolation functions available in the Chartist.Interpolation module, or write your own interpolation function. Check the examples for a brief description.
					  lineSmooth: true,
					  // Overriding the natural low of the chart allows you to zoom in or limit the charts lowest displayed value
					  low: 0,
					  // Overriding the natural high of the chart allows you to zoom in or limit the charts highest displayed value
					  high: 100,
					  // Padding of the chart drawing area to the container element and labels as a number or padding object {top: 5, right: 5, bottom: 5, left: 5}
					  chartPadding: {
					    top: 15,
					    right: 15,
					    bottom: 5,
					    left: 10
					  },
					  // When set to true, the last grid line on the x-axis is not drawn and the chart elements will expand to the full available width of the chart. For the last label to be drawn correctly you might need to add chart padding or offset the last label with a draw event handler.
					  fullWidth: true,
					  // If true the whole data is reversed including labels, the series order as well as the whole series data arrays.
					  reverseData: false,
					  // Override the class names that get used to generate the SVG structure of the chart
					  classNames: {
					    chart: 'ct-chart-line',
					    label: 'ct-label',
					    labelGroup: 'ct-labels',
					    series: 'ct-series',
					    line: 'ct-line',
					    point: 'ct-point',
					    area: 'ct-area',
					    grid: 'ct-grid',
					    gridGroup: 'ct-grids',
					    vertical: 'ct-vertical',
					    horizontal: 'ct-horizontal',
					    start: 'ct-start',
					    end: 'ct-end'
					  }
					};
					

			  // Initialize a Line chart in the container with the ID chart1
			  chart = new Chartist.Line('#chart1', {
			    labels: [1, 2, 3, 4],
			    series: [[10, 10, 50, 80]]
			  }, defaultOptions);
			  
			  initData();
			  
//			  var data12 = {
//					    labels: [5, 6, 7, 8],
//					    series: [[50, 50, 50, 50]]
//					  }; 
//			  
//			  chart.update(data12);
		};
		
		
		function getDateString(date){
			
//			return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() 
//					+ ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
			
			return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		}
		
		function initData(){
			
			var labelTemp = [];
			var dataTemp = [];
			// 서버에서 사이즈를 받아서 처리를 하도록 한다.
			//console.log((d.getDate() + 1).toString());
			//console.log(getDateString(d));
			//d = new Date(Date.parse(d) - (1000 * 10 * xSize)); // 5분전
			
			var d = new Date();
			d = new Date(Date.parse(d) - (1000 * 1 * xSize)); // 5분전
			//console.log(getDateString(d));

			for(var i = 0 ; i < xSize; i++) {
				var item = {y:getDateString(d), cpu:0};
				
				labelTemp.push(getDateString(d));
				dataTemp.push(0);
				//d = new Date(Date.parse(d) + (1000 * 10)); // 10 초 후
				d = new Date(Date.parse(d) + (1000 * 1)); // 1 초 후
			}
			
			chartLabel = labelTemp;
			chartData = dataTemp;

			chartUpdate(chartLabel, chartData);

			//setData($scope.id, data)
		}
		
		function chartUpdate(label, data){
			  var data = {
					    labels: label,
					    series: [data,]
					  }; 
				chart.update(data);
		}
		
		//initData();
		
		function makeData(message){
			
			console.log('makeData :');
			console.log(message);

			// 우선은 모두 재 생성하는 코드로 처리를 하도록 한다.
//			var tempLabel = [];
//			var tempData = [];
//			
//			for(var i = 0 ; i < chartLabel.length - 1; i++) {
//				tempLabel.push(chartLabel[i + 1]);
//				tempData.push(chartData[i + 1]);
//			}
			
			chartLabel.splice(0, 1);
			chartData.splice(0, 1);
			
			chartLabel.push(message.timestamp);
			chartData.push(message.cpuMax);
			
			chartUpdate(chartLabel, chartData);
			
//			var item = {y:message.timestamp, cpu:message.cpuMax};
//			tempData.push(item);			
//			data = tempData;
			
//			console.log('data :');
//			console.log(data);
//			setData($scope.id, data)
		}
		
		
		function setData(id, data){
			
			console.log('******************************************************');
			console.log(data);
			
			return;
			
			var newValue =  {
					element:'chart_1',
					data: data,
					xkey: 'y',
					ykeys: ['cpu'],
					ymax: 100,
					ymin: 0,
					pointSize : 0,
					labels: ['CPU']
					};
			
			$( "#chart_1" ).empty();
			Morris = {};
			Morris.Line(newValue);
			data =[];
		}
		
	})
	.controller("ResourceChartController2", function($scope, websokService) {

		console.log("ResourceChartController2");
		
		var data = [];
		var xSize = 6 * 5; // 1초당 (10초당)
		
		var subscriber = {};
		
		subscriber = websokService.subscribe("/topic/resourceMonitor");
		subscriber.listener.promise.then(null, null, function(message) {
			console.log("ResourceChartController receive");
			makeData(message);
	
	    });

		
		
		function getDateString(date){
			return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() 
					+ ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		}
		
		function initData(){
			data = [];
			
			// 서버에서 사이즈를 받아서 처리를 하도록 한다.
			//console.log((d.getDate() + 1).toString());
			//console.log(getDateString(d));
			//d = new Date(Date.parse(d) - (1000 * 10 * xSize)); // 5분전
			
			var d = new Date();
			d = new Date(Date.parse(d) - (1000 * 1 * xSize)); // 5분전
			//console.log(getDateString(d));

			for(var i = 0 ; i < xSize; i++) {
				var item = {y:getDateString(d), cpu:0};
				data.push(item);
				
				//d = new Date(Date.parse(d) + (1000 * 10)); // 10 초 후
				d = new Date(Date.parse(d) + (1000 * 1)); // 1 초 후
			}
			 
			 setData($scope.id, data)
		}
		
		initData();
		
		function makeData(message){
			
			console.log('makeData :');
			console.log(message);

			// 우선은 모두 재 생성하는 코드로 처리를 하도록 한다.
			var tempData = new Array();
			
			for(var i = 0 ; i < data.length - 1; i++) {
				tempData.push(data[i + 1]);
			}
			
			var item = {y:message.timestamp, cpu:message.cpuMax};
			tempData.push(item);			
			data = tempData;
			
//			console.log('data :');
//			console.log(data);
			setData($scope.id, data)
		}
		
		
		function setData(id, data){
			
			console.log('******************************************************');
			console.log(data);
			
			var newValue =  {
					element:'chart_1',
					data: data,
					xkey: 'y',
					ykeys: ['cpu'],
					ymax: 100,
					ymin: 0,
					pointSize : 0,
					labels: ['CPU']
					};
			
			$( "#chart_1" ).empty();
			Morris = {};
			Morris.Line(newValue);
			data =[];
		}
		
	})
	.controller("ResourceChartController", function($scope, websokService) {

		console.log("ResourceChartController");
		
		var data = [];
		var xSize = 6 * 5; // 1초당 (10초당)
		
		var subscriber = {};
		
		//$scope.idx = {};
		$scope.data = {};
		$scope.id = 'chart_1';
		
		//$scope.idx = 'harksoo';
		
		subscriber = websokService.subscribe("/omp/resourceMonitor");
		subscriber.listener.promise.then(null, null, function(message) {
			console.log("ResourceChartController receive");
			// makeData(message);
	
	    });
		
		function getDateString(date){
			return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() 
					+ ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		}
		
		function initData(){
			data = [];
			
			// 서버에서 사이즈를 받아서 처리를 하도록 한다.
			//console.log((d.getDate() + 1).toString());
			//console.log(getDateString(d));
			//d = new Date(Date.parse(d) - (1000 * 10 * xSize)); // 5분전
			
			var d = new Date();
			d = new Date(Date.parse(d) - (1000 * 1 * xSize)); // 5분전
			//console.log(getDateString(d));

			for(var i = 0 ; i < xSize; i++) {
				var item = {y:getDateString(d), cpu:0};
				data.push(item);
				
				//d = new Date(Date.parse(d) + (1000 * 10)); // 10 초 후
				d = new Date(Date.parse(d) + (1000 * 1)); // 1 초 후
			}
			 
			 setData($scope.id, data)
		}
		
		initData();
		
		function makeData(message){
			
			console.log('makeData :');
			console.log(message);

			// 우선은 모두 재 생성하는 코드로 처리를 하도록 한다.
			var tempData = new Array();
			
			for(var i = 0 ; i < data.length - 1; i++) {
				tempData.push(data[i + 1]);
			}
			
			var item = {y:message.timestamp, cpu:message.cpuMax};
			tempData.push(item);			
			data = tempData;
			
//			console.log('data :');
//			console.log(data);
			setData($scope.id, data)
		}
		
		
		function setData(id, data){
			
//			console.log('******************************************************');
//			console.log(data);			
//			data = [];			
//			data.push({y:"2015-7-13 15:23:18", cpu:10});
//			data.push({y:"2015-7-13 15:23:19", cpu:10});
//			data.push({y:"2015-7-13 15:23:20", cpu:10});
//			data.push({y:"2015-7-13 15:23:21", cpu:10});
//			data.push({y:"2015-7-13 15:23:22", cpu:10});
//			data.push({y:"2015-7-13 15:23:23", cpu:10});
//			data.push({y:"2015-7-13 15:23:24", cpu:10});
//			data.push({y:"2015-7-13 15:23:25", cpu:10});
			
			$scope.data = 
			{			
				element:'chart_1',
				data: data,
				xkey: 'y',
				ykeys: ['cpu'],
				ymax: 100,
				ymin: 0,
				pointSize : 0,
				labels: ['CPU']
			};
		}
		
	})
	// directive 에서 받을 수 없는 인자는 $scope
	.directive('resourceChart',['$document', function($document) {
		console.log("resourceChart");
		return {
			restrict: 'E',
			scope: {
				//id : '=',
				data : '=',
			},
			link: function(scope, element, attrs){

				var div;
				
				console.log(attrs.id);
				
				console.log('watch id :' + attrs.id);
				
				// directive의 attribute의 값을 가지고 id를 설정하는 방식
				element.children().empty();
				var divString = "<div id='" + attrs.id + "' style='height: 200px;'></div>"
				div = angular.element(divString);
				console.log(div);
				element.append(div);

//				//config attribute 값의 변경을 체크하여 반영한다.
//				scope.$watch('id', function(newValue){
//					console.log('watch id :' + newValue);
//					element.children().empty();
//					var divString = "<div id='" + newValue + "' style='height: 200px;'></div>"
//					div = angular.element(divString);
//					console.log(div);
//					div.id = newValue;
//					element.append(div);
//				});
								
				scope.$watch('data', function(newValue, oldValue){
					
					$( "#chart_1" ).empty();

					console.log('============================================================');
					//console.log(oldValue);
					console.log(newValue);
					
					
					Morris.Line(newValue);
				});
			}
		};
	}])
	;
	
})(angular);