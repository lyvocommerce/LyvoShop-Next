"use client";

import { useEffect } from "react";

export default function TelegramInit() {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      tg.expand();
      tg.ready();
    }
  }, []);

  return null;
}