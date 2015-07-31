/**
 * 
 */

(function(){

	angular.module("chat")
	.controller("chatController", function($scope, websokService) {

		console.log("chatController");
		var subscriber = {};
		
		subscriber = websokService.subscribe("/user/queue/greetings");
		subscriber.listener.promise.then(null, null, function(message) {
			console.log(message);
			$scope.messages.push(message);
	
	    });
		
		$scope.messages = [];
		$scope.message = "";
		$scope.max = 140;
		
		$scope.addMessage = function() {

			websokService.send($scope.message);
			$scope.message = "";
		};
		
		

		
//		websokService.receive().then(null, null, function(message){
//			//  TODO message가 오는 것만 확인
//			console.log(message);
//			//$scope.messages.push(message);
//		});
		
	});
	

})(angular);