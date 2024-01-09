import InvokeButton from './InvokeButton';
import SendButton from './SendButton';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.grid}>
        <a href="/" className={styles.card}>
          <h2>return to home</h2>
        </a>
        <SendButton />
        <InvokeButton />
      </div>
    </main>
  );
}
