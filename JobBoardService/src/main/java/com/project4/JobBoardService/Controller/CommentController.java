package com.project4.JobBoardService.Controller;
import com.project4.JobBoardService.DTO.CommentDTO;
import com.project4.JobBoardService.DTO.NewCommentDTO;
import com.project4.JobBoardService.DTO.NotificationDTO;
import com.project4.JobBoardService.Entity.Comment;
import com.project4.JobBoardService.Entity.Notification;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Enum.ENotificationType;
import com.project4.JobBoardService.Service.CommentService;
import com.project4.JobBoardService.Service.NotificationService;
import com.project4.JobBoardService.Service.UserService;
import com.project4.JobBoardService.Util.AuthorizationUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserService userService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private AuthorizationUtils authorizationUtils;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private SimpMessagingTemplate template;
//    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @GetMapping("/blog/{slug}")
    public ResponseEntity<List<CommentDTO>> getCommentsByBlogId(@PathVariable String slug) {
        try {
            List<Comment> comments = commentService.getCommentByBlogSlug(slug);
            return ResponseEntity.ok(comments.stream().map(comment -> modelMapper.map(comment, CommentDTO.class)).collect(Collectors.toList()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MODERATOR') or hasRole('ROLE_ADMIN') or hasRole('ROLE_EMPLOYER')")
    @PostMapping
    public ResponseEntity<?> createComment(@RequestBody Comment comment, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {

        ResponseEntity<?> authorizationResponse = authorizationUtils.authorize(token, comment.getUser().getUsername());
        if (authorizationResponse != null) {
            return authorizationResponse;
        }

        try {

            User user = userService.findByUsername(comment.getUser().getUsername()).orElse(null);
            User recipient = userService.findByUsername(comment.getBlog().getUser().getUsername()).orElse(null);

            if(user != null){
                comment.setUser(user);
                Comment createdComment = commentService.createComment(comment);
                NewCommentDTO commentResponse = modelMapper.map(createdComment, NewCommentDTO.class);


                if(user != recipient){
                    Notification notification = new Notification(user, recipient, ENotificationType.COMMENT,
                            "/blog/" + comment.getBlog().getSlug() + "#comment-" + comment.getId(), "commented on your post.", false);
                    Notification created = notificationService.createNotification(notification);
                    NotificationDTO response = modelMapper.map(created, NotificationDTO.class);
                    template.convertAndSend("/topic/notifications", response);
                }

                return ResponseEntity.ok(commentResponse);

            }







            return ResponseEntity.badRequest().body(null);


        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MODERATOR') or hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        try {
            Comment existingComment = commentService.getCommentById(id);

            String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();

            if (username.equals(existingComment.getUser().getUsername()) || username.equals(existingComment.getBlog().getUser().getUsername())) {
                commentService.deleteComment(id);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to delete this comment.");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MODERATOR') or hasRole('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(@PathVariable Long id, @RequestBody Comment comment, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        try {
            Comment existingComment = commentService.getCommentById(id);
            ResponseEntity<?> authorizationResponse = authorizationUtils.authorize(token, existingComment.getUser().getUsername());
            if (authorizationResponse != null) {
                return authorizationResponse;
            }

            Comment commentUpdate = commentService.updatedComment(id, comment);
            if (commentUpdate != null) {
                CommentDTO commentUpdateDTO = modelMapper.map(commentUpdate, CommentDTO.class);
                return ResponseEntity.ok(commentUpdateDTO);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }
}
