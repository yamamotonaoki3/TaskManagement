package com.taskmanagement.api.list;

import com.taskmanagement.api.task.TaskService;
import com.taskmanagement.api.task.dto.TaskReorderRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/lists")
public class TaskListController {

    private final TaskListService taskListService;
    private final TaskService taskService;

    public TaskListController(TaskListService taskListService, TaskService taskService) {
        this.taskListService = taskListService;
        this.taskService = taskService;
    }

    @GetMapping
    public List<TaskListResponse> getAll() {
        return taskListService.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskListResponse create(@RequestBody @Valid TaskListRequest req) {
        return taskListService.create(req);
    }

    @PatchMapping("/{listId}/tasks/reorder")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reorderTasks(@PathVariable Long listId,
                             @RequestBody @Valid TaskReorderRequest req) {
        taskService.reorderByIds(listId, req.taskIds());
    }
}
