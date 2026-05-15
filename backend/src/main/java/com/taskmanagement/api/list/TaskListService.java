package com.taskmanagement.api.list;

import com.taskmanagement.api.task.Task;
import com.taskmanagement.api.task.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class TaskListService {

    private final TaskListRepository taskListRepository;
    private final TaskRepository taskRepository;

    public TaskListService(TaskListRepository taskListRepository, TaskRepository taskRepository) {
        this.taskListRepository = taskListRepository;
        this.taskRepository = taskRepository;
    }

    public List<TaskListResponse> findAll() {
        List<TaskList> lists = taskListRepository.findAllByOrderByPositionAsc();

        List<Task> tasks = taskRepository.findByArchivedFalseOrderByTaskListIdAscPositionAsc();
        Map<Long, List<Task>> tasksByListId = tasks.stream()
                .collect(Collectors.groupingBy(t -> t.getTaskList().getId()));

        return lists.stream()
                .map(list -> TaskListResponse.from(list, tasksByListId.getOrDefault(list.getId(), List.of())))
                .toList();
    }
}
