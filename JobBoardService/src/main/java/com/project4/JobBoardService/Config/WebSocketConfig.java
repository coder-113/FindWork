package com.project4.JobBoardService.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Đăng ký một endpoint cho client (SockJS được sử dụng ở đây để hỗ trợ các trình duyệt không hỗ trợ WebSocket)
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:3000", "http://localhost:3001") // Cho phép tất cả các origin (để demo, bạn có thể cấu hình an toàn hơn)
                .withSockJS(); // Sử dụng SockJS
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Cấu hình message broker để phân phối các message từ server tới client
        registry.enableSimpleBroker("/topic", "/queue"); // Cho phép đăng ký các topic prefix "/topic"
        registry.setApplicationDestinationPrefixes("/app"); // Định nghĩa các message tới server với prefix "/app"
        registry.setUserDestinationPrefix("/user");
    }


}
