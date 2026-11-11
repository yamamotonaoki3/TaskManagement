package com.taskmanagement.api.task;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByTaskListUserIdAndArchivedFalseOrderByTaskListIdAscPositionAsc(Long userId);

    List<Task> findByTaskListUserId(Long userId);

    Optional<Task> findByIdAndTaskListUserId(Long id, Long userId);

    @Query("""
            SELECT t FROM Task t JOIN FETCH t.taskList l
            WHERE l.userId = :userId
              AND (LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
            ORDER BY l.id ASC, t.position ASC
            """)
    List<Task> searchByKeyword(@Param("userId") Long userId, @Param("keyword") String keyword);

    @Query("SELECT COALESCE(MAX(t.position), 0) FROM Task t WHERE t.taskList.id = :listId")
    int findMaxPositionByListId(@Param("listId") Long listId);

    List<Task> findByTaskListIdAndArchivedFalseOrderByPositionAsc(Long listId);

    List<Task> findByTaskListUserIdAndStatusOrderByCompletedAtDesc(Long userId, String status);

    long countByTaskListIdAndArchivedFalse(Long taskListId);

    void deleteByTaskListId(Long taskListId);
}
