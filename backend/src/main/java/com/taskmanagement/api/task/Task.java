package com.taskmanagement.api.task;

import com.taskmanagement.api.list.TaskList;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "task")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "list_id", nullable = false)
    private TaskList taskList;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDate dueDate;

    @Column(length = 10)
    private String priority;

    @Column(nullable = false, length = 20)
    private String status;

    private LocalDateTime completedAt;

    @Column(nullable = false)
    private boolean archived;

    @Column(nullable = false)
    private int position;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    protected Task() {}

    public Long getId() { return id; }
    public TaskList getTaskList() { return taskList; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public LocalDate getDueDate() { return dueDate; }
    public String getPriority() { return priority; }
    public String getStatus() { return status; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public boolean isArchived() { return archived; }
    public int getPosition() { return position; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
