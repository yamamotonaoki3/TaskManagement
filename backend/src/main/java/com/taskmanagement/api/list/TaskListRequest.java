package com.taskmanagement.api.list;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TaskListRequest(
        @NotBlank @Size(max = 255) String name
) {}
