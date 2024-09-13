package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.Config.Annotation.CheckPermission;
import com.project4.JobBoardService.DTO.*;
import com.project4.JobBoardService.Entity.Blog;
import com.project4.JobBoardService.Entity.BlogCategory;
import com.project4.JobBoardService.Entity.HashTag;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Enum.EPermissions;
import com.project4.JobBoardService.Service.BlogCategoryService;
import com.project4.JobBoardService.Service.BlogService;
import com.project4.JobBoardService.Service.UserService;
import com.project4.JobBoardService.payload.PaginatedResponse;
import org.apache.coyote.Response;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {

    @Autowired
    private BlogService blogService;

    @Autowired
    private BlogCategoryService blogCategoryService;

    @Autowired
    private UserService userService;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private ModelMapper modelMapper;



    private ConcurrentMap<String, Integer> readingCount = new ConcurrentHashMap<>();

    @GetMapping("/blog/{id}")
    public void getBlog(@PathVariable String id) {
        int count = readingCount.getOrDefault(id, 0) + 1;
        readingCount.put(id, count);
        simpMessagingTemplate.convertAndSend("/topic/blog/" + id, count);
    }

    @GetMapping("/count-by-user-and-month")
    public ResponseEntity<List<UserBlogCountDTO>> getBlogCountByUserAndMonth(@RequestParam int year) {
        List<Object[]> results = blogService.getBlogCountByUserAndMonth(year);
        List<UserBlogCountDTO> blogCounts = results.stream()
                .map(result -> new UserBlogCountDTO((String) result[0], (int) result[1], (long) result[2]))
                .collect(Collectors.toList());
        return ResponseEntity.ok(blogCounts);
    }

    @GetMapping("/blog/{id}/leave")
    public void leaveBlog(@PathVariable String id) {
        int count = readingCount.getOrDefault(id, 0) - 1;
        readingCount.put(id, count);
        simpMessagingTemplate.convertAndSend("/topic/blog/" + id, count);
    }


    @GetMapping("/search")
    public ResponseEntity<?> searchBlogs(
            @RequestParam String query,
            @RequestParam(defaultValue = "ALL") String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer visibility,
            @RequestParam(defaultValue = "asc") String order,
            @RequestParam(required = false, defaultValue = "false") Boolean archive // Thêm tham số này
    ) {
        Sort sort = order.equalsIgnoreCase("desc") ? Sort.by("createdAt").descending() : Sort.by("createdAt").ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Boolean visibilityFlag = visibility == 0 ? Boolean.TRUE : visibility == 1 ? Boolean.FALSE : null;

        // Gọi searchBlogs với tham số archive
        Page<Blog> blogsPage = blogService.searchBlogs(query, "ALL".equals(type) ? null : type, pageable, visibilityFlag, archive);

        List<BlogResponseDTO> blogResponseDTOs = blogsPage.stream()
                .map(blog -> modelMapper.map(blog, BlogResponseDTO.class))
                .collect(Collectors.toList());

        PaginatedResponse<BlogResponseDTO> response = new PaginatedResponse<>();
        response.setContent(blogResponseDTOs);
        response.setCurrentPage(blogsPage.getNumber());
        response.setTotalPages(blogsPage.getTotalPages());
        response.setTotalItems(blogsPage.getTotalElements());

        return ResponseEntity.ok(response);
    }


    @GetMapping("/hashtags")
    public ResponseEntity<List<HashTagDTO>> getAllHashTags(){
            try {
                List<HashTag> hashTags = blogService.getAllHashTag();
                List<HashTagDTO> hashTagDTOS = hashTags.stream().map(hashTag -> modelMapper.map(hashTag, HashTagDTO.class)).toList();
                return ResponseEntity.ok(hashTagDTOS);
            }catch(Exception e){
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MODERATOR')")
    @CheckPermission(EPermissions.MANAGE_BLOG)
    @PutMapping("/archive")
    public ResponseEntity<?> updateIsArchiveStatus(@RequestBody UpdateArchiveRequestDTO request) {
        blogService.updateIsArchiveStatus(request.getBlogIds(), request.getIsArchive() == 1 ? Boolean.TRUE : Boolean.FALSE);
        return ResponseEntity.ok("Blog archive status updated successfully");
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MODERATOR')")
    @CheckPermission(EPermissions.MANAGE_BLOG)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createBlog(@ModelAttribute BlogDTO blogDTO) {
        try {
            List<Long> categoryIds = blogDTO.getCategoryIds();
            List<BlogCategory> categories = categoryIds.stream()
                    .map(id -> blogCategoryService.getBlogCategoryById(id))
                    .collect(Collectors.toList());

            Blog checkExistBlog = blogService.getBlogByTitle(blogDTO.getTitle());
            if(checkExistBlog != null){
                return ResponseEntity.badRequest().body("Title already exists in blog table.");
            }

            if (categories.stream().anyMatch(category -> category == null)) {
                return ResponseEntity.badRequest().body("No categories found in category table.");
            }
            User user = userService.findByUsername(blogDTO.getUsername()).orElse(null);
            if (user == null) {
                return ResponseEntity.badRequest().body("User doesn't exist in user table.");
            }

            String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
            if (username.equals(user.getUsername())) {
                Blog blog = modelMapper.map(blogDTO, Blog.class);
                blog.setUser(user);
                blog.setCategories(categories);
                Blog createdBlog = blogService.createBlog(blog, blogDTO.getImage(), blogDTO.getHashtags());
                BlogResponseDTO responseDto = modelMapper.map(createdBlog, BlogResponseDTO.class);
                return ResponseEntity.ok(responseDto);
            }
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to create this blog.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get all blogs
    @GetMapping
    public ResponseEntity<List<BlogResponseDTO>> getAllBlogs() {
        try {
            List<Blog> blogs = blogService.getAllBlog();

            List<BlogResponseDTO> blogResponseDTOs = blogs.stream().map(blog -> {
                BlogResponseDTO blogResponseDTO = modelMapper.map(blog, BlogResponseDTO.class);
                blogResponseDTO.setCommentCount(blog.getComments().size());  // Set the number of comments
                return blogResponseDTO;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(blogResponseDTOs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }


    @GetMapping("/excel")
    @PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_MODERATOR')")
    public ResponseEntity<byte[]> exportDataToExcel() {
        try {
            List<Blog> blogs = blogService.getAllBlog();

            // Create workbook and sheet
            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet("Blogs");
            // Create column headers
            String[] columnHeaders = {"ID", "Title", "Category", "Visibility", "Posted By", "Comments"};
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < columnHeaders.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columnHeaders[i]);
            }
            // Add data rows
            int rowNum = 1;
            for (Blog blog : blogs) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(blog.getId());
                row.createCell(1).setCellValue(blog.getTitle());
                row.createCell(2).setCellValue(
                        blog.getCategories().stream()
                                .map(category -> category.getName())
                                .collect(Collectors.joining(", "))
                );
                row.createCell(3).setCellValue(blog.isVisibility() ? "Show" : "Hide");
                row.createCell(4).setCellValue(blog.getUser() != null ? blog.getUser().getUsername() : "N/A");
                row.createCell(5).setCellValue(blog.getComments() != null ? blog.getComments().size() : 0);
            }

            for (int i = 0; i < columnHeaders.length; i++) {
                sheet.autoSizeColumn(i);
            }

            // Write data to ByteArrayOutputStream
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            workbook.close();

            // Set headers for file download
            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.add("Content-Disposition", "attachment; filename=blogs.xlsx");

            // Return file as byte array
            return new ResponseEntity<>(out.toByteArray(), responseHeaders, HttpStatus.OK);

        } catch (IOException e) {
            // Log the error and return a server error response
            e.printStackTrace(); // You may want to use a logging framework instead
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/popular")
    public ResponseEntity<List<BlogResponseDTO>> getPopularBlog(){
        try {
            List<Blog> popularBlogs = blogService.getPopularBlog();
            List<BlogResponseDTO> popularBlogDTO = popularBlogs.stream().map(blog -> modelMapper.map(blog, BlogResponseDTO.class)).collect(Collectors.toList());
            return ResponseEntity.ok(popularBlogDTO);
        }catch(Exception e){
            return ResponseEntity.internalServerError().build();
        }
    }


    // Get a single blog by slug
    @GetMapping("/{slug}")
    public ResponseEntity<BlogResponseDTO> getBlogBySlug(@PathVariable String slug) {
        try {
            Blog blog = blogService.getBlogBySlug(slug);
            if (blog == null) {
                return ResponseEntity.notFound().build();
            }
            blogService.incrementViewBlog(blog);
            BlogResponseDTO blogResponseDTO = modelMapper.map(blog, BlogResponseDTO.class);

            return ResponseEntity.ok(blogResponseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Update a blog
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MODERATOR')")
    @CheckPermission(EPermissions.MANAGE_BLOG)
    @PutMapping("/{id}")
    public ResponseEntity<BlogResponseDTO> updateBlog(@PathVariable Long id,
                                                      @ModelAttribute BlogDTO blogDTO) {
        try {
            // Lấy danh sách id của BlogCategory từ BlogDTO
            List<Long> categoryIds = blogDTO.getCategoryIds();
            List<BlogCategory> categories = categoryIds.stream()
                    .map(ids -> blogCategoryService.getBlogCategoryById(ids))
                    .collect(Collectors.toList());

            // Kiểm tra xem tất cả các BlogCategory có tồn tại không
            if (categories.stream().anyMatch(category -> category == null)) {
                return ResponseEntity.badRequest().build(); // Nếu một trong các BlogCategory không tồn tại, trả về lỗi BadRequest
            }


            Blog blog = modelMapper.map(blogDTO, Blog.class);
            blog.setCategories(categories);


            // Update blog
            Blog updatedBlog = blogService.updateBlog(id, blog, blogDTO.getImage(), blogDTO.getHashtags());
            if(updatedBlog != null){
                BlogResponseDTO responseDto = modelMapper.map(updatedBlog, BlogResponseDTO.class);
                return ResponseEntity.ok(responseDto);
            }

            return ResponseEntity.notFound().build();

            // Map Blog đã cập nhật thành BlogResponseDTO và gửi thông báo WebSocket
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Delete a blog
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MODERATOR')")
    @CheckPermission(EPermissions.MANAGE_BLOG)
    @DeleteMapping("/{id}")
    public ResponseEntity<Long> deleteBlog(@PathVariable Long id) {
        try {
            blogService.deleteBlog(id);
            return ResponseEntity.ok().body(id);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
