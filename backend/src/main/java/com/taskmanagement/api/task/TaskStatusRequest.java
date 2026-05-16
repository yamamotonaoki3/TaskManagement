package com.taskmanagement.api.task;

import jakarta.validation.constraints.NotBlank;

public record TaskStatusRequest(
        @NotBlank String status,
        Long listId,
        Integer position
) {}
