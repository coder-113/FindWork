package com.project4.JobBoardService.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;



@Service
public class TemplateService {

    private final CloudflareService cloudflareService;
    private final CloudflareConfig cloudflareConfig;

    @Autowired
    public TemplateService(CloudflareService cloudflareService, CloudflareConfig cloudflareConfig) {
        this.cloudflareService = cloudflareService;
        this.cloudflareConfig = cloudflareConfig;
    }

    public Mono<String> storeTemplate(String templateName, String templateHtml) {
        String key = templateName; // Generate a unique key based on templateName
        String kvNamespace = cloudflareConfig.getKvNamespace();
        String accountId = cloudflareConfig.getAccountId();

        return cloudflareService.storeTemplate(key, templateHtml, accountId, kvNamespace);
    }
    public Mono<String> updateTemplate(String templateName, String templateHtml) {
        String key = templateName; // Generate a unique key based on templateName
        String kvNamespace = cloudflareConfig.getKvNamespace();
        String accountId = cloudflareConfig.getAccountId();

        return cloudflareService.storeTemplate(key, templateHtml, accountId, kvNamespace);
    }

    public Mono<String> retrieveTemplate(String key) {
        String kvNamespace = cloudflareConfig.getKvNamespace();
        String accountId = cloudflareConfig.getAccountId();

        return cloudflareService.getTemplate(key, accountId, kvNamespace);
    }


}
