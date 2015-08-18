angular.module("alarm.controllers").controller("AlarmCtrl", function($scope, $timeout, AlarmService) {
	$scope.messages = [];
	$scope.message = "";
	
	$scope.count = 0;
	$scope.alarmList = [];
//	$timeout(function(){
//		SystemMoniService.send('/app/getAll', 'getAll');
//	}, 500);
	
	
	// 알람발생시  받아옴
	AlarmService.receive().then( null, null, function( data ) {

		if ( $scope.count == 0 ) {
			//시작시간
			console.log( '===============================================' );
			console.log( 'Start 시간 :: ' + data.date );
			console.log( '===============================================' );
		}
		
		if ( $scope.alarmList.length === 10 ) {
			$scope.alarmList.shift();
		}
		$scope.alarmList.push( data );
		
		$scope.count = $scope.count + 1; 
		console.log( '>>>>>>>>>>>>>>>>>>>' +  $scope.count );
		if ( $scope.count == 100 ) {
			//receive stop
			console.log( '===============================================' );
			console.log( 'End 시간 :: ' + data.date );
			console.log( '===============================================' );
			$scope.count = 0; 
		}
	});	
	
});
