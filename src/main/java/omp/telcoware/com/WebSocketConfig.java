package omp.telcoware.com;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;

@Configuration
@EnableScheduling
@EnableWebSocketMessageBroker
public class WebSocketConfig extends AbstractWebSocketMessageBrokerConfigurer {


	@Override
	public void configureMessageBroker(MessageBrokerRegistry config) {
		// TODO Auto-generated method stub
		//super.configureMessageBroker(registry);
		//config.enableSimpleBroker("/topic,/user");
		config.enableSimpleBroker("/queue", "/topic");
		//config.enableSimpleBroker("/omp");

		//config.enableSimpleBroker("/test");
		//config.enableSimpleBroker("/user");
		config.setApplicationDestinationPrefixes("/app");
	}
	
	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/omp").withSockJS();
	}
	
}
