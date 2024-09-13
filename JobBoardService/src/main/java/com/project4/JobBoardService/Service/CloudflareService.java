package com.project4.JobBoardService.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;

@Service
public class CloudflareService {

	 private final WebClient webClient;
	    private final String baseUrl;
	    private final String accountId;
	    private final String kvNamespace;

    @Autowired
    public CloudflareService(WebClient.Builder webClientBuilder, CloudflareConfig cloudflareConfig) {
        this.webClient = webClientBuilder.baseUrl("https://api.cloudflare.com/client/v4/accounts/")
                .defaultHeader("Authorization", "Bearer " + cloudflareConfig.getApiToken())
                .build();
        this.baseUrl = cloudflareConfig.getAccountId();
        this.accountId = cloudflareConfig.getAccountId();
        this.kvNamespace = cloudflareConfig.getKvNamespace();
    }

    public Mono<String> storeTemplate(String key, String templateHtml, String accountId, String kvNamespace) {
        String uri = String.format("%s/storage/kv/namespaces/%s/values/%s", baseUrl, kvNamespace, key);

        return webClient.put()
                .uri(uri, accountId)
                .contentType(MediaType.TEXT_PLAIN)
                .bodyValue(templateHtml)
                .retrieve()
                .bodyToMono(String.class)
                .doOnError(e -> {
                    // Log or handle the error appropriately
                    System.err.println("Error storing template: " + e.getMessage());
                })
                .onErrorResume(e -> {
                    // Handle the error and potentially return a meaningful error message
                    return Mono.error(new RuntimeException("Failed to store template: " + e.getMessage()));
                });
    }

    public Mono<String> getTemplate(String key, String accountId, String kvNamespace) {
        String uri = String.format("%s/storage/kv/namespaces/%s/values/%s", baseUrl, kvNamespace, key);

        return webClient.get()
                .uri(uri, accountId)
                .retrieve()
                .bodyToMono(String.class)
                .doOnError(e -> {
                    // Log or handle the error appropriately
                    System.err.println("Error retrieving template: " + e.getMessage());
                })
                .onErrorResume(e -> {
                    // Handle the error and potentially return a meaningful error message
                    return Mono.error(new RuntimeException("Failed to retrieve template: " + e.getMessage()));
                });
    }
}
