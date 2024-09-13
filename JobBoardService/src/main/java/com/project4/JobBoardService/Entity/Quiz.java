package com.project4.JobBoardService.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "quizzes")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    @Column(length = 1000) // Set the length to 1000 characters or any length you need
    private String description;

    private String imageUrl;
    private String thumbnailUrl;


    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Question> questions = new ArrayList<>();
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;



    @ManyToOne
    @JoinColumn(name = "category_id")
    private CategoryQuiz category;


    public Quiz(Long id) {
        this.id = id;
    }
    private int numberOfUsers; // Add this field

    public void incrementNumberOfUsers() {
        this.numberOfUsers++;
    }


    @ManyToMany(mappedBy = "completedQuizzes")
    private Set<User> usersCompleted = new HashSet<>();

    public void setCategoryId(Long categoryId) {
    }
}

