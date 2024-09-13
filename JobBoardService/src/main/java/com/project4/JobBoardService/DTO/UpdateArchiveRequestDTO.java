package com.project4.JobBoardService.DTO;


import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UpdateArchiveRequestDTO {
    private List<Long> blogIds;
    private Integer isArchive;
}
