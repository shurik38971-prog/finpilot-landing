import { createClient } from "@/lib/supabase/server";
import {
  calculateFinancialIndex,
  monthlyDebtPayments,
  monthlyExpenseTotal,
  monthlyIncomeTotal,
  totalDebtRemaining,
} from "@/lib/finance/index";
import { forecastCashFlow } from "@/lib/finance/forecast";
import { calculateDebtPayoff } from "@/lib/finance/debt-strategies";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY не настроен" },
      { status: 500 }
    );
  }

  const [incomesRes, expensesRes, debtsRes] = await Promise.all([
    supabase.from("incomes").select("*").eq("user_id", user.id),
    supabase.from("expenses").select("*").eq("user_id", user.id),
    supabase.from("debts").select("*").eq("user_id", user.id),
  ]);

  const incomes = incomesRes.data ?? [];
  const expenses = expensesRes.data ?? [];
  const debts = debtsRes.data ?? [];

  const monthlyIncome = monthlyIncomeTotal(incomes);
  const monthlyExpenses = monthlyExpenseTotal(expenses);
  const debtPayments = monthlyDebtPayments(debts);
  const totalDebt = totalDebtRemaining(debts);
  const netCashFlow = monthlyIncome - monthlyExpenses - debtPayments;
  const financialIndex = calculateFinancialIndex(incomes, expenses, debts);
  const forecast = forecastCashFlow(incomes, expenses, debts);
  const avalanche = calculateDebtPayoff(debts, 0, "avalanche");

  const financialContext = {
    monthlyIncome: Math.round(monthlyIncome),
    monthlyExpenses: Math.round(monthlyExpenses),
    debtPayments: Math.round(debtPayments),
    netCashFlow: Math.round(netCashFlow),
    totalDebt: Math.round(totalDebt),
    financialIndex,
    incomeSources: incomes.length,
    essentialExpenses: expenses.filter((e) => e.is_essential).length,
    nonEssentialExpenses: expenses.filter((e) => !e.is_essential).length,
    debtCount: debts.length,
    monthsToDebtFree: avalanche.monthsToFreedom,
    threeMonthForecast: forecast.map((f) => ({
      month: f.month,
      net: f.net,
      cumulative: f.cumulative,
    })),
  };

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `Ты — персональный ИИ-финансовый директор для самозанятого человека с нестабильным доходом и долгами. 
Отвечай на русском языке. Будь конкретным, практичным и поддерживающим.
Верни JSON с полями:
- "summary": string (2-3 абзаца общей оценки)
- "risks": string[] (3-5 ключевых рисков)
- "recommendations": string[] (3-5 рекомендаций)
- "actionPlan": string[] (5-7 конкретных шагов на ближайший месяц)`,
      },
      {
        role: "user",
        content: `Проанализируй финансовое состояние:\n${JSON.stringify(financialContext, null, 2)}`,
      },
    ],
    temperature: 0.7,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    return NextResponse.json({ error: "Пустой ответ от ИИ" }, { status: 500 });
  }

  try {
    const analysis = JSON.parse(content);
    return NextResponse.json(analysis);
  } catch {
    return NextResponse.json({ error: "Ошибка парсинга ответа" }, { status: 500 });
  }
}
