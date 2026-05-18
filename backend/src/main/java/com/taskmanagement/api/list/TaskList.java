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

    @Column(name = "is_default", nullable = false)
    private boolean isDefault;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    protected TaskList() {}

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getName() { return name; }
    public int getPosition() { return position; }
    public boolean isDefault() { return isDefault; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setUserId(Long userId) { this.userId = userId; }
    public void setName(String name) { this.name = name; }
    public void setPosition(int position) { this.position = position; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
