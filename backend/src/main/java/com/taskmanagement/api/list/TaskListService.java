package com.taskmanagement.api.list;

import com.taskmanagement.api.security.CurrentUserProvider;
import com.taskmanagement.api.task.Task;
import com.taskmanagement.api.task.TaskRepository;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class TaskListService {

    /** 新規ユーザー登録時に作成するデフォルトカラム（表示順）。 */
    static final List<String> DEFAULT_LIST_NAMES = List.of("やること", "進行中", "完了");

    private final TaskListRepository taskListRepository;
    private final TaskRepository taskRepository;
    private final CurrentUserProvider currentUserProvider;

    public TaskListService(
            TaskListRepository taskListRepository,
            TaskRepository taskRepository,
            CurrentUserProvider currentUserProvider) {
        this.taskListRepository = taskListRepository;
        this.taskRepository = taskRepository;
        this.currentUserProvider = currentUserProvider;
    }

    @Transactional
    public TaskListResponse create(TaskListRequest req) {
        Long userId = currentUserProvider.getCurrentUserId();
        int nextPosition = taskListRepository.findMaxPositionByUserId(userId) + 1;
        TaskList saved = taskListRepository.save(newList(userId, req.name(), nextPosition, false));
        return TaskListResponse.from(saved, List.of());
    }

    /**
     * 指定ユーザーにデフォルトカラム（削除不可）を作成する。
     */
    @Transactional
    public void createDefaultLists(Long userId) {
        for (int i = 0; i < DEFAULT_LIST_NAMES.size(); i++) {
            taskListRepository.save(newList(userId, DEFAULT_LIST_NAMES.get(i), i, true));
        }
    }

    @Transactional
    public void reorderLists(List<Long> listIds) {
        Long userId = currentUserProvider.getCurrentUserId();
        List<TaskList> lists = taskListRepository.findByUserIdOrderByPositionAsc(userId);
        Map<Long, TaskList> listMap = lists.stream()
                .collect(Collectors.toMap(TaskList::getId, l -> l));
        for (int i = 0; i < listIds.size(); i++) {
            TaskList l = listMap.get(listIds.get(i));
            if (l != null) {
                l.setPosition(i);
            }
        }
        taskListRepository.saveAll(lists);
    }

    @Transactional
    public void delete(Long listId) {
        Long userId = currentUserProvider.getCurrentUserId();
        TaskList list = taskListRepository.findByIdAndUserId(listId, userId)
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
        Long userId = currentUserProvider.getCurrentUserId();
        List<TaskList> lists = taskListRepository.findByUserIdOrderByPositionAsc(userId);

        List<Task> tasks = taskRepository.findByTaskListUserIdAndArchivedFalseOrderByTaskListIdAscPositionAsc(userId);
        Map<Long, List<Task>> tasksByListId = tasks.stream()
                .collect(Collectors.groupingBy(t -> t.getTaskList().getId()));

        return lists.stream()
                .map(list -> TaskListResponse.from(list, tasksByListId.getOrDefault(list.getId(), List.of())))
                .toList();
    }

    private static TaskList newList(Long userId, String name, int position, boolean isDefault) {
        TaskList list = new TaskList();
        list.setUserId(userId);
        list.setName(name);
        list.setPosition(position);
        list.setDefault(isDefault);
        list.setCreatedAt(LocalDateTime.now());
        return list;
    }
}
