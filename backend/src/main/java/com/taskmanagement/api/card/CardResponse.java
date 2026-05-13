package com.taskmanagement.api.card;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record CardResponse(
        Long id,
        Long listId,
        String listName,
        String title,
        String description,
        LocalDate dueDate,
        String priority,
        boolean archived,
        int position,
        LocalDateTime createdAt
) {
    static CardResponse from(Card card) {
        return new CardResponse(
                card.getId(),
                card.getTaskList().getId(),
                card.getTaskList().getName(),
                card.getTitle(),
                card.getDescription(),
                card.getDueDate(),
                card.getPriority(),
                card.isArchived(),
                card.getPosition(),
                card.getCreatedAt()
        );
    }
}
