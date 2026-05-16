package com.taskmanagement.api.task;

import com.taskmanagement.api.list.TaskList;
import com.taskmanagement.api.list.TaskListRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.SequencedCollection;

@Service
@Transactional(readOnly = true)
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskListRepository taskListRepository;

    public TaskService(TaskRepository taskRepository, TaskListRepository taskListRepository) {
        this.taskRepository = taskRepository;
        this.taskListRepository = taskListRepository;
    }

    public List<TaskResponse> findAll() {
        return taskRepository.findByArchivedFalseOrderByTaskListIdAscPositionAsc()
                .stream()
                .map(TaskResponse::from)
                .toList();
    }

    public TaskResponse findById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found: " + id));
        return TaskResponse.from(task);
    }

    @Transactional
    public TaskResponse create(TaskRequest req) {
        TaskList list = taskListRepository.findById(req.listId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "List not found: " + req.listId()));
        int nextPos = taskRepository.findMaxPositionByListId(req.listId()) + 1;
        Task task = new Task();
        task.setTaskList(list);
        task.setTitle(req.title());
        task.setDescription(req.description());
        task.setDueDate(req.dueDate());
        task.setPriority(req.priority() != null ? req.priority() : "medium");
        task.setStatus("todo");
        task.setPosition(nextPos);
        task.setArchived(false);
        task.setCreatedAt(LocalDateTime.now());
        return TaskResponse.from(taskRepository.save(task));
    }

    public List<TaskResponse> search(String query) {
        if (query == null || query.isBlank()) {
            return taskRepository.findAll()
                    .stream()
                    .map(TaskResponse::from)
                    .toList();
        }

        // スペース区切りで複数キーワードに分割し、各キーワードで OR 検索、重複を排除
        SequencedCollection<Task> results = Arrays.stream(query.trim().split("\\s+"))
                .flatMap(keyword -> taskRepository.searchByKeyword(keyword).stream())
                .collect(LinkedHashSet::new, LinkedHashSet::add, LinkedHashSet::addAll);

        return results.stream()
                .map(TaskResponse::from)
                .toList();
    }
}
