package com.project4.JobBoardService.Config;

import com.project4.JobBoardService.DTO.ApplicationDTO;
import com.project4.JobBoardService.DTO.BlogCategoryDTO;
import com.project4.JobBoardService.DTO.BlogResponseDTO;
import com.project4.JobBoardService.DTO.JobDTO;
import com.project4.JobBoardService.Entity.Blog;
import com.project4.JobBoardService.Entity.Job;
import com.project4.JobBoardService.Entity.JobApplication;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.TypeMap;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.stream.Collectors;

@Configuration
public class ModelMapperConfig {
//
//    @Bean
//    public ModelMapper modelMapper() {
//        return new ModelMapper();
//    }

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);

        modelMapper.addMappings(new PropertyMap<JobApplication, ApplicationDTO>() {
            @Override
            protected void configure() {
                map().setUserId(source.getUser().getId());
                map(source.getJob(), destination.getJobDTO());
                map(source.getCompany().getCompanyId(), destination.getJobDTO().getCompanyId());// Ensure correct mapping
                map(source.getCompany(), destination.getCompanyDTO());
                modelMapper.createTypeMap(Job.class, JobDTO.class);
            }

        });
        // Add any additional configurations or mappings here

        return modelMapper;
    }

}
