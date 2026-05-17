package com.taskmanagement.api.task;

import com.taskmanagement.api.list.TaskList;
import com.taskmanagement.api.list.TaskListRepository;
import com.taskmanagement.api.task.dto.TaskReorderRequest;
import com.taskmanagement.api.task.dto.TaskRequest;
import com.taskmanagement.api.task.dto.TaskStatusRequest;
import com.taskmanagement.api.task.dto.TaskUpdateRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.SequencedCollection;
import java.util.stream.Collectors;

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

    @Transactional
    public TaskResponse updateStatus(Long id, TaskStatusRequest req) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found: " + id));

        // カラム移動
        if (req.listId() != null && !req.listId().equals(task.getTaskList().getId())) {
            TaskList newList = taskListRepository.findById(req.listId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "List not found: " + req.listId()));
            task.setTaskList(newList);
        }

        // status 更新
        task.setStatus(req.status());
        if ("done".equals(req.status())) {
            task.setCompletedAt(LocalDateTime.now());
        } else {
            task.setCompletedAt(null);
        }

        // position 更新（指定がある場合）
        if (req.position() != null) {
            reorderPosition(task, req.position());
        }

        return TaskResponse.from(taskRepository.save(task));
    }

    private void reorderPosition(Task movedTask, int newPosition) {
        Long listId = movedTask.getTaskList().getId();
        List<Task> siblings = taskRepository.findByTaskListIdAndArchivedFalseOrderByPositionAsc(listId);
        siblings.remove(movedTask);
        int clampedPos = Math.max(0, Math.min(newPosition, siblings.size()));
        siblings.add(clampedPos, movedTask);
        for (int i = 0; i < siblings.size(); i++) {
            siblings.get(i).setPosition(i);
        }
        taskRepository.saveAll(siblings);
    }

    @Transactional
    public TaskResponse updateTask(Long id, TaskUpdateRequest req) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found: " + id));

        if (req.title() != null) task.setTitle(req.title());
        task.setDescription(req.description()); // null で明示的にクリア可能
        if (req.dueDate() != null) task.setDueDate(req.dueDate());
        if (req.priority() != null) task.setPriority(req.priority());

        return TaskResponse.from(taskRepository.save(task));
    }

    @Transactional
    public void reorderByIds(Long listId, List<Long> taskIds) {
        List<Task> tasks = taskRepository.findByTaskListIdAndArchivedFalseOrderByPositionAsc(listId);
        Map<Long, Task> taskMap = tasks.stream().collect(Collectors.toMap(Task::getId, t -> t));
        for (int i = 0; i < taskIds.size(); i++) {
            Task t = taskMap.get(taskIds.get(i));
            if (t != null) t.setPosition(i);
        }
        taskRepository.saveAll(tasks);
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
