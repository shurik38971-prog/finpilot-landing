# FinPilot

Личный ИИ-финансовый директор для самозанятого человека с нестабильным доходом и долгами.

## Стек

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **Supabase** (Auth + Postgres)
- **Recharts**
- **OpenAI API**

## Возможности MVP

- Авторизация через Supabase
- Дашборд с финансовой сводкой
- CRUD для доходов, расходов и долгов
- Финансовый индекс (0–100)
- Прогноз денежного потока на 3 месяца
- Антикризисный режим: метод лавины и снежного кома
- Сценарии «что будет, если»
- ИИ-анализ через `/api/analyze`

## Быстрый старт

### 1. Установка

```bash
npm install
```

### 2. Переменные окружения

Скопируйте `.env.example` в `.env.local`:

```bash
cp .env.example .env.local
```

Заполните:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
OPENAI_API_KEY=...
```

### 3. База данных

Выполните SQL-миграцию в Supabase SQL Editor:

```
supabase/migrations/001_initial_schema.sql
```

### 4. Запуск

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Структура проекта

```
src/
├── app/
│   ├── (app)/          # Защищённые страницы с сайдбаром
│   ├── api/analyze/    # ИИ-анализ
│   ├── auth/           # OAuth callback
│   ├── login/          # Вход
│   └── signup/         # Регистрация
├── components/
│   ├── ui/             # Базовые UI-компоненты
│   ├── layout/         # Shell, Sidebar, PageHeader
│   ├── dashboard/      # Виджеты дашборда
│   ├── forms/          # Формы CRUD
│   └── crud/           # Переиспользуемый RecordList
├── lib/
│   ├── finance/        # Бизнес-логика
│   ├── supabase/       # Клиенты Supabase
│   └── actions/        # Server Actions
└── types/              # TypeScript типы
```

## Демо-данные

На дашборде нажмите **«Загрузить демо-данные»** — появятся примеры доходов, расходов и долгов самозанятого. Кнопка **«Перезагрузить демо»** доступна, когда данные уже есть.

## Деплой на Vercel

### Через CLI

```bash
npm i -g vercel
vercel login
vercel
```

При деплое добавьте переменные окружения в Vercel Dashboard → Settings → Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`

### Через GitHub

1. Запушьте репозиторий на GitHub
2. Импортируйте проект на [vercel.com/new](https://vercel.com/new)
3. Добавьте env-переменные
4. Deploy

### Supabase после деплоя

В Supabase → Authentication → URL Configuration добавьте URL Vercel в **Redirect URLs**:

```
https://your-app.vercel.app/auth/callback
```

## Финансовый индекс

Индекс от 0 до 100 учитывает:

- Соотношение чистого потока к доходу (30%)
- Долговую нагрузку (25%)
- Подушку безопасности (20%)
- Долю обязательных расходов (15%)
- Диверсификацию доходов (10%)
