package com.project4.JobBoardService.Repository;

import com.project4.JobBoardService.Entity.Blog;
import com.project4.JobBoardService.Entity.BlogCategory;
import com.project4.JobBoardService.Entity.Comment;
import com.project4.JobBoardService.Entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BlogRepository extends JpaRepository<Blog, Long> {
    long countByUserAndCreatedAtBetween(User user, LocalDateTime startDate, LocalDateTime endDate);
    @Query("SELECT COUNT(b) FROM Blog b")
    long countBlogs();


    @Query("SELECT b.user.username, MONTH(b.createdAt), COUNT(b) " +
            "FROM Blog b " +
            "JOIN b.user u " +
            "LEFT JOIN u.roles r " +
            "LEFT JOIN u.permissions p " +
            "WHERE YEAR(b.createdAt) = :year " +
            "AND (r.name = 'ROLE_ADMIN' " +
            "     OR (r.name = 'ROLE_MODERATOR' AND p.name = 'MANAGE_BLOG')) " +
            "GROUP BY b.user.username, MONTH(b.createdAt)")
    List<Object[]> countBlogsByUserAndMonth(@Param("year") int year);


    int countByCategories(BlogCategory blogCategory);

    Blog findBySlug(@Param("slug") String slug);

    int countByComments(Comment comment);

    Blog findByTitle(String title);

    @Query("SELECT DISTINCT b FROM Blog b " +
            "JOIN b.categories c " +
            "LEFT JOIN b.hashtags h " +
            "WHERE (:type IS NULL OR c.name = :type) " +
            "AND (LOWER(b.title) LIKE %:query% " +
            "OR LOWER(b.content) LIKE %:query% " +
            "OR LOWER(c.name) LIKE %:query% " +
            "OR LOWER(h.name) LIKE %:query%) " +
            "AND (:visibility IS NULL OR b.visibility = :visibility) " +
            "AND (:archive IS NULL OR b.isArchive = :archive)")
    Page<Blog> searchByQuery(@Param("type") String type,
                             @Param("query") String query,
                             @Param("visibility") Boolean visibility,
                             @Param("archive") Boolean archive,
                             Pageable pageable);


    @Modifying
    @Transactional
    @Query("UPDATE Blog b SET b.view = b.view + 1 WHERE b.id = :blogId")
    void incrementViewCount(@Param("blogId") Long blogId);

    @Query(value = "SELECT * FROM Blog b ORDER BY b.view DESC LIMIT 4", nativeQuery = true)
    List<Blog> findTop4ByOrderByViewDesc();

}


