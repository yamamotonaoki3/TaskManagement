package com.taskmanagement.api.task;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<TaskResponse> getAll() {
        return taskService.findAll();
    }

    @GetMapping("/{id}")
    public TaskResponse getById(@PathVariable Long id) {
        return taskService.findById(id);
    }

    @GetMapping("/search")
    public List<TaskResponse> search(@RequestParam(required = false) String q) {
        return taskService.search(q);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskResponse create(@RequestBody @Valid TaskRequest req) {
        return taskService.create(req);
    }

    @PatchMapping("/{id}/status")
    public TaskResponse updateStatus(@PathVariable Long id, @RequestBody @Valid TaskStatusRequest req) {
        return taskService.updateStatus(id, req);
    }

    @PatchMapping("/{id}")
    public TaskResponse updateTask(@PathVariable Long id, @RequestBody @Valid TaskUpdateRequest req) {
        return taskService.updateTask(id, req);
    }
}
