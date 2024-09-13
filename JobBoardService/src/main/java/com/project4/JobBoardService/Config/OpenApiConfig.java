package com.project4.JobBoardService.Config;

import io.swagger.v3.oas.models.*;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.parameters.Parameter;
import io.swagger.v3.oas.models.parameters.RequestBody;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI openAPI(
            @Value("${openapi.service.title}") String title,
            @Value("${openapi.service.version}") String version,
            @Value("${openapi.service.server}") String serverUrl) {
        return new OpenAPI()
                .servers(List.of(new Server().url(serverUrl)))
                .info(new Info().title(title)
                        .description("API documents")
                        .version(version)
                        .license(new License().name("Apache 2.0").url("https://springdoc.org")))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .paths(new Paths()
                        .addPathItem("/api/companies/add/{id}/upload-logo", new PathItem()
                                .post(new Operation()
                                        .operationId("uploadLogo")
                                        .parameters(Arrays.asList(
                                                new Parameter()
                                                        .in("path")
                                                        .name("id")
                                                        .required(true)
                                                        .schema(new Schema().type("string"))
                                                        .description("ID of the company to upload logo")
                                        ))
                                        .summary("Upload Logo for Company")
                                        .requestBody(new RequestBody()
                                                .content(new Content()
                                                        .addMediaType("multipart/form-data", new MediaType()
                                                                .schema(new Schema().type("object")
                                                                        .addProperties("file", new Schema().type("string").format("binary"))
                                                                )
                                                        )
                                                )
                                        )
                                        .responses(new ApiResponses()
                                                .addApiResponse("200", new ApiResponse()
                                                        .description("OK")
                                                )
                                        )
                                )
                        )
                );
    }

    @Bean
    public GroupedOpenApi groupedOpenApi(){
        return GroupedOpenApi.builder()
                .group("api-service-1")
                .packagesToScan("com.project4.JobBoardService.Controller")
                .build();
    }
}
