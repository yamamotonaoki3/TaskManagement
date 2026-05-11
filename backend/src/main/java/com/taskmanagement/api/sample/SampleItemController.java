package com.taskmanagement.api.sample;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * DB 接続確認用の使い捨て REST コントローラ。本ドメイン実装時に削除予定。
 *
 * GET  /api/sample-items       … 全件取得
 * POST /api/sample-items       … {"name": "..."} を受けて1件作成
 */
@RestController
@RequestMapping("/api/sample-items")
public class SampleItemController {

    private final SampleItemRepository repository;

    public SampleItemController(SampleItemRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<SampleItem> list() {
        return repository.findAll();
    }

    @PostMapping
    public SampleItem create(@RequestBody CreateRequest request) {
        return repository.save(new SampleItem(request.name()));
    }

    public record CreateRequest(String name) {
    }
}
