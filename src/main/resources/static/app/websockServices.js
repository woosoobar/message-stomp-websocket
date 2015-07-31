
// inject underscore "_" param
(function(angular, SockJS, Stomp, _, undefined){
	
	console.log("websokServiceModule");
	
	angular.module("websokServiceModule").service("websokService", function($q, $timeout) {
		
		console.log("websokServiceModule");
		
		var service = {};
		var listener = $q.defer();
		var socket = { client: null, stomp: null };
		var messageIds = [];		
		var subscribers = [];
		
		service.RECONNECT_TIMEOUT = 10000;
		service.SOCKET_URL = "/omp";
		service.REALTIMEALARM_TOPIC = "/topic/realtimeAlarm";
		//service.CHAT_BROKER = "/app/chat";
		//service.CHAT_BROKER = "/app/userhello";
		service.CHAT_BROKER = "/app/userhello";
		
		function getGUID() {
		  var h=['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
		  var k=['x','x','x','x','x','x','x','x','-','x','x','x','x','-','4','x','x','x','-','y','x','x','x','-','x','x','x','x','x','x','x','x','x','x','x','x'];
		  var u='',i=0,rb=Math.random()*0xffffffff|0;
		  while(i++<36) {
		    var c=k[i-1],r=rb&0xf,v=c=='x'?r:(r&0x3|0x8);
		    u+=(c=='-'||c=='4')?c:h[v];
		    rb=i%8==0?Math.random()*0xffffffff|0:rb>>4;
		  }
		  return u
		}
		
		
		var initialize = function() {
			// TODO reconnection  처리 시에 socketurl이 유지 되는지 확인 요망.
			// onclose의 처리 방안 확인
			
			socket.client = new SockJS(service.SOCKET_URL);
			socket.stomp = Stomp.over(socket.client);
			socket.stomp.connect({}, startListener);
			socket.stomp.onclose = reconnect;
			
		};
		
		service.disconnect = function(){
			socket.stomp.disconnect();
		}
		
		service.setUrl = function(url){
			service.SOCKET_URL = url;
		};
		
		// ms Unit
		service.setReconnectTimeout = function(timeout){
			console.log("onclose");
			service.RECONNECT_TIMEOUT  = timeout;
		};
		
		service.receive = function(){
			// TODO 상태확인 요망.
			return listener.promise;
		};
		
		service.send = function(message) {
			// TOOD guid 로 전달하는 방식으로 변경 요망.
			var id = Math.floor((Math.random() * 1000000));
			
			// TODO 
			socket.stomp.send(
					service.CHAT_BROKER,
					{ priority: 9 },
					JSON.stringify({ message:message, id: getGUID(), time:null})
					);
			messageIds.push(id);
		};
		
		// TODO 왜  this.RECONNECT_TIMEOUT 이 설정이 될 수 있는지 확인 요망.
		// 서버가 종료 시 클라이언트에서 접속 종료에 대한 이벤트 확인 요망.
		var reconnect = function(){
			
			console.log('===================================');
			console.log('close');
			$timeout(function(){
				initialize();
			}, this.RECONNECT_TIMEOUT);
		};
		
		// 
		var getMessage = function(data){
			
			console.log("call getMessage : " + data);
			return JSON.parse(data);
			
//			var message = JSON.parse(data), out = {};
//			out.message = message.message;
//			out.time = new Date(message.time);
//			
//			// messageIds에서 해당 message를 삭제 처리
//			if(_.contains(messageIds, message.id)) {
//				// TODO 본인이 보낸 메시지 인가..?
//				out.self = true;
//				messageIds = _.remove(messageIds, message.id);
//			}
//			
//			return out;
		};
		
		
		// TODO 실제 한개의 쓰레드로 동작을 함으로 빠지는 경우가 있는지 확인 : 입력후 아래의 함수가 실행이 안되는 경우..
		var startListener = function() {
			
			//console.log(subscribers[0]);
			
			console.log(subscribers);
			for(var i = 0 ; i < subscribers.length; i++){
				var sub = subscribers[i];
				sub.info = socket.stomp.subscribe(sub.endpointUrl, makeSubscribeCallback(sub.listener));
				//console.log(sub);
			}
			console.log("call startListener Complete");
		};
		
		// closuser : 환경과 기능을 가지는 오브텍트의 생성
		function makeSubscribeCallback(listener){
			return function(data){
				listener.notify(getMessage(data.body));
			};
		}

		
		// subscribe를 외부에서 할지, 아니면, message에 따라서 분할 처리 할지 확인 후 처러 요망.
		// endpointUrl 을 별로도 두어서 관리를 하는것이 좋을 것 같음...?
		service.subscribe = function(endpointUrl) {
			
			var subscriber = {};
			var q = $q.defer();
			subscriber.listener = q;
			subscriber.endpointUrl = endpointUrl;
			subscriber.info = {};
			
			// reconnect 시 사용
			subscribers.push(subscriber);
			
			if(socket.stomp.connected){
				subcriber.info = socket.stomp.subscribe(subscriber.endpointUrl, makeSubscribeCallback(subscriber.listener));
			}
			
			console.log("call subscribe : " + endpointUrl);			
			return subscriber;
		};
		
		service.unsubscribe = function(subscriber) {
			
			if(_.contains(subscribers, subscriber)) {
				subscribers = _.remove(subscribers, subscriber);
				
				subscriber.info.unsubscribe();
				console.log("call unsubscribe : " + subscriber.endpointUrl);
			}
			
		};
		
		// connect 의 처리
		initialize();
		
		return service;
	});

})(angular, SockJS, Stomp, _);