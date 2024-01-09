'use client';

import React from 'react';
import styles from './page.module.css';

export default function InvokeButton() {
  return (
    <button
      className={styles.card}
      onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const res = await window.electronAPI.invokeExample({
          message: 'invoke',
        });
        alert(res);
      }}
      type="submit"
    >
      <h2>ipc invoke</h2>
    </button>
  );
}
