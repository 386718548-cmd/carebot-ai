'use client';

import { useEffect } from 'react';
import { useLocale } from '@/hooks/useI18n';

type Reminder = {
  id: string;
  medicineId: string;
  medicineName: string;
  time: string;
  label: string;
  enabled: boolean;
  voice: boolean;
  lastFiredDate?: string;
};

const REMINDERS_KEY = 'medassist_reminders_v1';

function safeParseReminders(raw: string | null): Reminder[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter((r) => typeof r?.id === 'string' && typeof r?.time === 'string');
  } catch {
    return [];
  }
}

function localDateKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function localHHMM(d: Date) {
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function speak(locale: 'en' | 'zh', text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = locale === 'zh' ? 'zh-CN' : 'en-US';
  utter.rate = locale === 'zh' ? 0.9 : 0.95;
  window.speechSynthesis.speak(utter);
}

export function ReminderRunner() {
  const { locale } = useLocale();

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const hhmm = localHHMM(now);
      const today = localDateKey(now);
      const reminders = safeParseReminders(window.localStorage.getItem(REMINDERS_KEY));
      const due = reminders.filter((r) => r.enabled && r.time === hhmm && r.lastFiredDate !== today);
      if (!due.length) return;

      const message =
        locale === 'zh'
          ? `到点吃药：${due.map((d) => d.medicineName).join('、')}`
          : `Medication time: ${due.map((d) => d.medicineName).join(', ')}`;

      window.alert(message);
      if (due.some((d) => d.voice)) speak(locale, message);

      const updated = reminders.map((r) => (due.some((d) => d.id === r.id) ? { ...r, lastFiredDate: today } : r));
      window.localStorage.setItem(REMINDERS_KEY, JSON.stringify(updated));
    };

    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, [locale]);

  return null;
}

