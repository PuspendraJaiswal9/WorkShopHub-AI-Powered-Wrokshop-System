package com.example.chatbot_service.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.Map;

@FeignClient(name = "azure-openai-client", url = "${azure.openai.endpoint}")
public interface AzureOpenAIClient {

    @PostMapping("/openai/deployments/{deploymentName}/chat/completions?api-version=2023-03-15-preview")
    Map<String, Object> sendRequest(@PathVariable("deploymentName") String deploymentName,
                                    @RequestBody Map<String, Object> body,
                                    @RequestHeader("api-key") String apiKey);
}
