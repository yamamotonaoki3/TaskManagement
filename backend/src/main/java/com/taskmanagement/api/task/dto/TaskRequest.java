package com.taskmanagement.api.task.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record TaskRequest(
        @NotNull Long listId,
        @NotBlank @Size(max = 255) String title,
        String description,
        LocalDate dueDate,
        String priority
) {}
