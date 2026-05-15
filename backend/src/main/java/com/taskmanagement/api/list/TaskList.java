package com.taskmanagement.api.list;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "task_list")
public class TaskList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int position;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    protected TaskList() {}

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getName() { return name; }
    public int getPosition() { return position; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
