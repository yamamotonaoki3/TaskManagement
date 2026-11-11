package com.taskmanagement.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.taskmanagement.api.auth.AuthService;
import com.taskmanagement.api.auth.RegisterRequest;
import com.taskmanagement.api.list.TaskListResponse;
import com.taskmanagement.api.list.TaskListService;
import com.taskmanagement.api.task.TaskResponse;
import com.taskmanagement.api.task.TaskService;
import com.taskmanagement.api.task.dto.TaskRequest;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/**
 * ユーザー間でカラム・タスクが分離されていることを検証する。
 * テストデータは testuser_ 接頭辞・example.com ドメインのみを使い、トランザクションのロールバックで後始末する。
 */
@SpringBootTest
@Transactional
class UserDataIsolationTests {

    private static final String USER_A = "testuser_isolation_a@example.com";
    private static final String USER_B = "testuser_isolation_b@example.com";
    private static final String PASSWORD = "TestPass123";

    @Autowired
    private AuthService authService;

    @Autowired
    private TaskListService taskListService;

    @Autowired
    private TaskService taskService;

    private TaskResponse taskOfA;

    @BeforeEach
    void setUp() {
        authService.register(new RegisterRequest(USER_A, PASSWORD, "テストユーザーA"));
        authService.register(new RegisterRequest(USER_B, PASSWORD, "テストユーザーB"));

        loginAs(USER_A);
        Long listIdOfA = taskListService.findAll().getFirst().id();
        taskOfA = taskService.create(new TaskRequest(listIdOfA, "[E2E_TEST] Aのタスク", null, null, null));
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("新規登録でデフォルトカラムが3つ作成される")
    void registerCreatesThreeDefaultLists() {
        loginAs(USER_B);
        List<TaskListResponse> lists = taskListService.findAll();
        assertThat(lists).extracting(TaskListResponse::name).containsExactly("やること", "進行中", "完了");
        assertThat(lists).allMatch(TaskListResponse::isDefault);
    }

    @Test
    @DisplayName("他ユーザーのカラムとタスクは一覧に含まれない")
    void otherUsersDataIsNotListed() {
        loginAs(USER_B);
        assertThat(taskListService.findAll())
                .allMatch(l -> l.tasks().isEmpty());
        assertThat(taskService.findAll()).isEmpty();
        assertThat(taskService.search("E2E_TEST")).isEmpty();
        assertThat(taskService.search(null)).isEmpty();
    }

    @Test
    @DisplayName("他ユーザーのタスクは取得も削除もできない")
    void cannotAccessOtherUsersTask() {
        loginAs(USER_B);
        Long id = taskOfA.id();
        assertThatThrownBy(() -> taskService.findById(id)).isInstanceOf(ResponseStatusException.class);
        assertThatThrownBy(() -> taskService.deleteById(id)).isInstanceOf(ResponseStatusException.class);
        assertThatThrownBy(() -> taskService.archive(id)).isInstanceOf(ResponseStatusException.class);

        loginAs(USER_A);
        assertThat(taskService.findById(id).title()).isEqualTo("[E2E_TEST] Aのタスク");
    }

    @Test
    @DisplayName("他ユーザーのカラムにはタスクを作成できない")
    void cannotCreateTaskInOtherUsersList() {
        loginAs(USER_A);
        Long listIdOfA = taskListService.findAll().getFirst().id();

        loginAs(USER_B);
        assertThatThrownBy(() -> taskService.create(new TaskRequest(listIdOfA, "[E2E_TEST] 不正", null, null, null)))
                .isInstanceOf(ResponseStatusException.class);
    }

    private static void loginAs(String email) {
        SecurityContextHolder.getContext()
                .setAuthentication(new UsernamePasswordAuthenticationToken(email, null, List.of()));
    }
}
