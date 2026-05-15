import styles from './Header.module.css';

interface HeaderProps {
  query: string;
  onQueryChange: (q: string) => void;
}

export function Header({ query, onQueryChange }: HeaderProps) {
  return (
    <header className={styles.header}>
      <span className={styles.logo}>TaskBoard</span>
      <input
        type="search"
        className={styles.search}
        placeholder="タスクを検索..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
    </header>
  );
}
