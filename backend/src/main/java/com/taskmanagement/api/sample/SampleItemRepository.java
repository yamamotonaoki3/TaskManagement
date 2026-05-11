package com.taskmanagement.api.sample;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * DB 接続確認用の使い捨てリポジトリ。本ドメイン実装時に削除予定。
 */
public interface SampleItemRepository extends JpaRepository<SampleItem, Long> {
}
