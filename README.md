# FinPilot Landing

Маркетинговый лендинг FinPilot. Отдельный проект от приложения.

## Связь с приложением

Кнопки и форма ведут в личный кабинет по адресу из `NEXT_PUBLIC_APP_URL`.

| Проект | Папка | Порт (dev) | Назначение |
|--------|-------|------------|------------|
| **Лендинг** | `A:\Projects\ lendihg FinPilot` | 3001 | Маркетинг, SEO |
| **Приложение** | `A:\Projects\FinPilot` | 3000 | Личный кабинет, анализ |

GitHub: `shurik38971-prog/finpilot-landing` (лендинг) · `shurik38971-prog/finpilot` (приложение)

**У лендинга нет Supabase и миграций** — только ссылки в приложение через `NEXT_PUBLIC_APP_URL`.

## Запуск

```bash
# Терминал 1 — приложение
cd "A:\Projects\FinPilot"
npm run dev

# Терминал 2 — лендинг
cd "A:\Projects\ lendihg FinPilot"
npm run dev
```

Лендинг: http://localhost:3001  
Приложение: http://localhost:3000

## Переменные окружения

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

В продакшене укажите URL приложения, например `https://app.finpilot.ru`.
