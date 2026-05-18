package com.taskmanagement.api.task.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record TaskUpdateRequest(
        @Size(min = 1, max = 255) String title,
        String description,
        LocalDate dueDate,
        @Pattern(regexp = "^(high|medium|low)$") String priority
) {}
