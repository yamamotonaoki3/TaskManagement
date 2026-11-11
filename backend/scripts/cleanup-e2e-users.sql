-- README 用 GIF 撮影・手動確認で作成したテストデータを削除する。
-- 対象: メールアドレスが e2euser_ で始まる example.com ユーザーと、その所有カラム・タスク。
-- 実行例: docker exec -i taskboard-db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < backend/scripts/cleanup-e2e-users.sql

BEGIN;

DELETE FROM task
WHERE list_id IN (
    SELECT tl.id FROM task_list tl
    JOIN users u ON u.id = tl.user_id
    WHERE u.email LIKE 'e2euser\_%@example.com'
);

DELETE FROM task_list
WHERE user_id IN (SELECT id FROM users WHERE email LIKE 'e2euser\_%@example.com');

DELETE FROM users WHERE email LIKE 'e2euser\_%@example.com';

COMMIT;

-- 残数の確認（すべて 0 であること）
SELECT
    (SELECT COUNT(*) FROM users WHERE email LIKE 'e2euser\_%@example.com') AS remaining_users,
    (SELECT COUNT(*) FROM task_list tl JOIN users u ON u.id = tl.user_id
        WHERE u.email LIKE 'e2euser\_%@example.com') AS remaining_lists;
