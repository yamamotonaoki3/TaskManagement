import { useRef, useState } from 'react';

import { useAuth } from '../../hooks/useAuth';
import styles from './Header.module.css';

interface HeaderProps {
  query: string;
  onQueryChange: (q: string) => void;
}

export function Header({ query, onQueryChange }: HeaderProps) {
  const { logout, nickname, updateNickname } = useAuth();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function startEdit() {
    setDraft(nickname);
    setError('');
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function cancelEdit() {
    setEditing(false);
    setError('');
  }

  async function saveEdit() {
    const trimmed = draft.trim();
    if (trimmed.length === 0) {
      setError('ニックネームを入力してください');
      return;
    }
    if (trimmed.length > 50) {
      setError('50文字以内で入力してください');
      return;
    }
    await updateNickname(trimmed);
    setEditing(false);
    setError('');
  }

  return (
    <header className={styles.header}>
      <span className={styles.logo}>TaskBoard</span>
      <div className={styles.right}>
        <input
          type="search"
          className={styles.search}
          placeholder="タスクを検索..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
        {nickname && !editing && (
          <span className={styles.nicknameWrapper}>
            <span className={styles.nickname}>{nickname}</span>
            <button className={styles.editButton} onClick={startEdit} aria-label="ニックネームを編集">
              ✏️
            </button>
          </span>
        )}
        {editing && (
          <span className={styles.nicknameWrapper}>
            <input
              ref={inputRef}
              className={styles.nicknameInput}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit();
                if (e.key === 'Escape') cancelEdit();
              }}
              maxLength={50}
            />
            {error && <span className={styles.nicknameError}>{error}</span>}
            <button className={styles.saveButton} onClick={saveEdit}>保存</button>
            <button className={styles.cancelButton} onClick={cancelEdit}>取消</button>
          </span>
        )}
        {!editing && (
          <button className={styles.logoutButton} onClick={logout}>
            ログアウト
          </button>
        )}
      </div>
    </header>
  );
}
