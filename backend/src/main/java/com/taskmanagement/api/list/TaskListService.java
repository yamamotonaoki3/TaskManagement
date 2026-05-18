package com.taskmanagement.api.list;

import com.taskmanagement.api.task.Task;
import com.taskmanagement.api.task.TaskRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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

    @Transactional
    public TaskListResponse create(TaskListRequest req) {
        int nextPosition = taskListRepository.findMaxPosition() + 1;
        TaskList list = new TaskList();
        list.setUserId(1L);
        list.setName(req.name());
        list.setPosition(nextPosition);
        list.setCreatedAt(LocalDateTime.now());
        TaskList saved = taskListRepository.save(list);
        return TaskListResponse.from(saved, List.of());
    }

    @Transactional
    public void reorderLists(List<Long> listIds) {
        List<TaskList> lists = taskListRepository.findAllByOrderByPositionAsc();
        Map<Long, TaskList> listMap = lists.stream()
                .collect(Collectors.toMap(TaskList::getId, l -> l));
        for (int i = 0; i < listIds.size(); i++) {
            TaskList l = listMap.get(listIds.get(i));
            if (l != null) l.setPosition(i);
        }
        taskListRepository.saveAll(lists);
    }

    @Transactional
    public void delete(Long listId) {
        TaskList list = taskListRepository.findById(listId)
                .orElseThrow(() -> new EntityNotFoundException("リストが見つかりません: " + listId));
        if (list.isDefault()) {
            throw new IllegalStateException("デフォルトカラムは削除できません");
        }
        long taskCount = taskRepository.countByTaskListIdAndArchivedFalse(listId);
        if (taskCount > 0) {
            throw new IllegalStateException("タスクが残っているカラムは削除できません");
        }
        taskRepository.deleteByTaskListId(listId);
        taskListRepository.delete(list);
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
