'use client';

import React from 'react';
import styles from './page.module.css';

export default function SendButton() {
  return (
    <button
      className={styles.card}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        window.electronAPI.sendExample('message from renderer: send');
      }}
      type="submit"
    >
      <h2>ipc send</h2>
    </button>
  );
}
