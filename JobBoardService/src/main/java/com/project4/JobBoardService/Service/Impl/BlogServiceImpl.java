package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.Entity.Blog;
import com.project4.JobBoardService.Entity.HashTag;
import com.project4.JobBoardService.Repository.BlogRepository;
import com.project4.JobBoardService.Repository.CommentRepository;
import com.project4.JobBoardService.Repository.HashTagRepository;
import com.project4.JobBoardService.Repository.UserRepository;
import com.project4.JobBoardService.Service.BlogService;
import com.project4.JobBoardService.Util.FileUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

@Service
public class BlogServiceImpl implements BlogService {
    private static final Logger logger = Logger.getLogger(BlogService.class.getName());

    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HashTagRepository hashTagRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Override
    public Blog createBlog(Blog blog, MultipartFile imageFile, List<String> hashtagNames) {
        handleImageFile(blog, imageFile, "create");
        blog.setIsArchive(false);
        List<HashTag> hashTags = new ArrayList<>();
        for (String tagName : hashtagNames) {
            HashTag hashTag = hashTagRepository.findByName(tagName)
                    .orElseGet(() -> {
                        HashTag newTag = new HashTag();
                        newTag.setName(tagName);
                        return hashTagRepository.save(newTag);
                    });
            hashTags.add(hashTag);
        }
        blog.setHashtags(hashTags);

        return blogRepository.save(blog);
    }

    @Override
    public List<Blog> getAllBlog() {
        return blogRepository.findAll();
    }

    @Override
    public Blog getBlogById(Long id) {
        return blogRepository.findById(id).orElse(null);
    }

    @Override
    public Blog updateBlog(Long id, Blog updatedBlog, MultipartFile imageFile, List<String> hashtagNames) {
        Blog existingBlog = blogRepository.findById(id).orElse(null);
        if (existingBlog != null) {
            updateBlogDetails(existingBlog, updatedBlog);
            handleImageFile(existingBlog, imageFile, "update");

            List<HashTag> hashTags = new ArrayList<>();
            for (String tagName : hashtagNames) {
                HashTag hashTag = hashTagRepository.findByName(tagName)
                        .orElseGet(() -> {
                            HashTag newTag = new HashTag();
                            newTag.setName(tagName);
                            return hashTagRepository.save(newTag);
                        });
                hashTags.add(hashTag);
            }
            existingBlog.setHashtags(hashTags);

            return blogRepository.save(existingBlog);
        } else {
            logger.warning("Blog not found: " + id);
            return null;
        }
    }

    @Override
    public void deleteBlog(Long id) {
        Blog existingBlog = blogRepository.findById(id).orElse(null);
        if (existingBlog != null) {
            deleteImageFile(existingBlog);
            blogRepository.deleteById(id);
        }
    }

    @Override
    public Blog getBlogBySlug(String slug) {
        return blogRepository.findBySlug(slug);
    }




    private void handleImageFile(Blog blog, MultipartFile imageFile, String operationType) {
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                if ("update".equals(operationType)) {
                    deleteImageFile(blog);
                }
                // Save original image
                Path originalFilePath = FileUtils.saveFile(imageFile, "blog");
                String originalImageUrl = FileUtils.convertToUrl(originalFilePath, "blog");
                blog.setImageUrl(originalImageUrl);
                logger.info("Original image " + ("update".equals(operationType) ? "updated and saved" : "saved") + " to: " + originalImageUrl);

                // Save thumbnail
                int thumbnailWidth = 1200;
                int thumbnailHeight = 800;
                Path thumbnailFilePath = FileUtils.saveResizedImage(imageFile, "blog", thumbnailWidth, thumbnailHeight);
                String thumbnailImageUrl = FileUtils.convertToUrl(thumbnailFilePath, "blog/thumbnail");
                blog.setThumbnailUrl(thumbnailImageUrl);
                logger.info("Thumbnail " + ("update".equals(operationType) ? "updated and saved" : "saved") + " to: " + thumbnailImageUrl);
            } catch (IllegalArgumentException | IOException e) {
                logger.warning("Invalid file: " + e.getMessage());
            }
        }
    }


    @Override
    public Page<Blog> searchBlogs(String query, String type, Pageable pageable, Boolean visibility, Boolean archive) {
        return blogRepository.searchByQuery(type, query, visibility, archive, pageable);
    }

    @Override
    public List<HashTag> getAllHashTag() {
        return hashTagRepository.findAll();
    }

    @Override
    public int getCommentCountByBlog(Blog blog) {
        return commentRepository.countByBlog(blog);
    }

    @Override
    public Blog getBlogByTitle(String title) {
        return blogRepository.findByTitle(title);
    }

    @Override
    public void incrementViewBlog(Blog blog) {
        blogRepository.incrementViewCount(blog.getId());
    }

    @Override
    public List<Blog> getPopularBlog() {
        return blogRepository.findTop4ByOrderByViewDesc();
    }

    @Override
    public void updateIsArchiveStatus(List<Long> blogIds, boolean isArchive) {
        List<Blog> blogs = blogRepository.findAllById(blogIds);
        for (Blog blog : blogs) {
            blog.setIsArchive(isArchive);
        }
        blogRepository.saveAll(blogs);
    }

    @Override
    public List<Object[]> getBlogCountByUserAndMonth(int year) {
        return blogRepository.countBlogsByUserAndMonth(year);
    }

    private void deleteImageFile(Blog blog) {
        String imageUrl = blog.getImageUrl();
        if (imageUrl != null && !imageUrl.isEmpty()) {
            String[] urlParts = imageUrl.split("/uploads/");
            if (urlParts.length == 2) {
                String[] pathParts = urlParts[1].split("/");
                String folder = pathParts[0];
                String fileName = pathParts[1];
                boolean fileDeleted = FileUtils.deleteFile(folder, fileName);
                if (!fileDeleted) {
                    logger.warning("Failed to delete the image file: " + fileName);
                }
            }
        }
    }

    private void updateBlogDetails(Blog existingBlog, Blog updatedBlog) {
        existingBlog.setTitle(updatedBlog.getTitle());
        existingBlog.setContent(updatedBlog.getContent());
        existingBlog.setCategories(updatedBlog.getCategories());
        existingBlog.setVisibility(updatedBlog.isVisibility());
        existingBlog.setSlug(updatedBlog.getSlug());
        existingBlog.setCitation(updatedBlog.getCitation());
    }
}
