package com.project4.JobBoardService.Service;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "cloudflare")
public class CloudflareConfig {

    private String kvNamespace;
    private String accountId;
    private String apiToken;

    // Getters and Setters
    public String getKvNamespace() {
        return kvNamespace;
    }

    public void setKvNamespace(String kvNamespace) {
        this.kvNamespace = kvNamespace;
    }

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public String getApiToken() {
        return apiToken;
    }

    public void setApiToken(String apiToken) {
        this.apiToken = apiToken;
    }
}
