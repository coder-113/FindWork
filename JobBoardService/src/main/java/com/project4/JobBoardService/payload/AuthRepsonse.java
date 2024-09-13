package com.project4.JobBoardService.payload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthRepsonse {
    private String email;
    private boolean verified; // Trường này cho biết trạng thái xác minh của người dùng
}
