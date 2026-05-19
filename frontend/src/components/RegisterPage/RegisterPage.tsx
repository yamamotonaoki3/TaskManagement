import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { register, saveToken } from '../../api/authApi';
import styles from './RegisterPage.module.css';

export function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!confirmPassword) {
      setError('確認用パスワードを入力してください');
      return;
    }
    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError('パスワードは英字と数字を含めてください');
      return;
    }
    setLoading(true);
    try {
      const { token } = await register(email, password, nickname);
      saveToken(token);
      navigate('/');
    } catch (err) {
      const status = (err as { response?: { status?: number } }).response?.status;
      if (status === 409) {
        setError('このメールアドレスは既に登録されています');
      } else {
        setError('登録に失敗しました。しばらく経ってから再度お試しください');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>アカウント登録</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="nickname" className={styles.label}>ニックネーム（50文字以内）</label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className={styles.input}
              required
              maxLength={50}
              autoComplete="nickname"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>メールアドレス</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
              autoComplete="email"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>パスワード（8〜64文字、英字と数字を含む）</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
              minLength={8}
              maxLength={64}
              autoComplete="new-password"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="confirmPassword" className={styles.label}>パスワード（確認）</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
              minLength={8}
              maxLength={64}
              autoComplete="new-password"
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? '登録中...' : '登録する'}
          </button>
        </form>
        <p className={styles.link}>
          アカウントをお持ちの方は<a href="/login">こちらからログイン</a>
        </p>
      </div>
    </div>
  );
}
