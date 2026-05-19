import { useAuth } from '../../hooks/useAuth';
import styles from './Header.module.css';

interface HeaderProps {
  query: string;
  onQueryChange: (q: string) => void;
}

export function Header({ query, onQueryChange }: HeaderProps) {
  const { logout } = useAuth();
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
        <button className={styles.logoutButton} onClick={logout}>
          ログアウト
        </button>
      </div>
    </header>
  );
}
