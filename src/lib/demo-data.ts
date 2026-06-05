import type { Frequency } from "@/types/database";

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

export const DEMO_INCOMES = [
  {
    title: "Разработка для клиента",
    amount: 85000,
    category: "freelance",
    date: daysAgo(5),
    is_recurring: true,
    frequency: "monthly" as Frequency,
  },
  {
    title: "Консультация (разовая)",
    amount: 25000,
    category: "project",
    date: daysAgo(12),
    is_recurring: false,
    frequency: null,
  },
  {
    title: "Роялти с курса",
    amount: 15000,
    category: "royalty",
    date: daysAgo(20),
    is_recurring: true,
    frequency: "quarterly" as Frequency,
  },
  {
    title: "Проект на Tilda",
    amount: 45000,
    category: "project",
    date: daysAgo(35),
    is_recurring: false,
    frequency: null,
  },
];

export const DEMO_EXPENSES = [
  {
    title: "Аренда квартиры",
    amount: 35000,
    category: "housing",
    date: daysAgo(3),
    is_recurring: true,
    frequency: "monthly" as Frequency,
    is_essential: true,
  },
  {
    title: "Продукты и быт",
    amount: 18000,
    category: "food",
    date: daysAgo(7),
    is_recurring: true,
    frequency: "monthly" as Frequency,
    is_essential: true,
  },
  {
    title: "Транспорт",
    amount: 8000,
    category: "transport",
    date: daysAgo(10),
    is_recurring: true,
    frequency: "monthly" as Frequency,
    is_essential: true,
  },
  {
    title: "Cursor + Figma",
    amount: 5000,
    category: "business",
    date: daysAgo(15),
    is_recurring: true,
    frequency: "monthly" as Frequency,
    is_essential: true,
  },
  {
    title: "Подписки (Netflix, Spotify)",
    amount: 2500,
    category: "subscriptions",
    date: daysAgo(18),
    is_recurring: true,
    frequency: "monthly" as Frequency,
    is_essential: false,
  },
  {
    title: "Коммунальные",
    amount: 6500,
    category: "utilities",
    date: daysAgo(22),
    is_recurring: true,
    frequency: "monthly" as Frequency,
    is_essential: true,
  },
];

export const DEMO_DEBTS = [
  {
    title: "Кредитная карта",
    total_amount: 150000,
    remaining_amount: 120000,
    interest_rate: 29.9,
    minimum_payment: 8000,
    due_day: 15,
    priority: 1,
  },
  {
    title: "Потребительский кредит",
    total_amount: 500000,
    remaining_amount: 350000,
    interest_rate: 18,
    minimum_payment: 15000,
    due_day: 5,
    priority: 2,
  },
  {
    title: "Займ у друга",
    total_amount: 50000,
    remaining_amount: 50000,
    interest_rate: 0,
    minimum_payment: 5000,
    due_day: 25,
    priority: 3,
  },
];
