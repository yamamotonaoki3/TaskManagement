package com.taskmanagement.api.list;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TaskListRepository extends JpaRepository<TaskList, Long> {

    List<TaskList> findByUserIdOrderByPositionAsc(Long userId);

    Optional<TaskList> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT COALESCE(MAX(l.position), -1) FROM TaskList l WHERE l.userId = :userId")
    int findMaxPositionByUserId(@Param("userId") Long userId);
}
