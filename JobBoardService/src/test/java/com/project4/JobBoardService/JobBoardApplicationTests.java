package com.project4.JobBoardService;

import com.project4.JobBoardService.Service.BlogCategoryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.ComponentScan;

@SpringBootTest
@ComponentScan(basePackages = {"com.project4.JobBoardService"})
class JobBoardApplicationTests {
    @Autowired
    BlogCategoryService blogCategoryService;



}
