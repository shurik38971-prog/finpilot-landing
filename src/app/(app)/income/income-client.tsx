"use client";

import { RecordList, Badge, formatCurrency, formatDate } from "@/components/crud/record-list";
import { IncomeForm } from "@/components/forms/income-form";
import { PageHeader } from "@/components/layout/page-header";
import { deleteIncome } from "@/lib/actions/finance";
import type { Income } from "@/types/database";
import { TrendingUp } from "lucide-react";

function IncomeFormWrapper({
  item,
  onSuccess,
}: {
  item?: Income;
  onSuccess: () => void;
}) {
  return <IncomeForm income={item} onSuccess={onSuccess} />;
}

export function IncomePageClient({ incomes }: { incomes: Income[] }) {
  return (
    <div>
      <PageHeader
        title="Доходы"
        description="Учёт доходов — разовых и повторяющихся"
      />
      <RecordList
        items={incomes}
        columns={[
          { key: "title", label: "Название" },
          {
            key: "amount",
            label: "Сумма",
            render: (i) => formatCurrency(i.amount),
          },
          {
            key: "category",
            label: "Категория",
            render: (i) => <Badge>{i.category}</Badge>,
          },
          {
            key: "date",
            label: "Дата",
            render: (i) => formatDate(i.date),
          },
          {
            key: "is_recurring",
            label: "Тип",
            render: (i) =>
              i.is_recurring ? (
                <Badge variant="success">Повторяющийся</Badge>
              ) : (
                <Badge>Разовый</Badge>
              ),
          },
        ]}
        emptyIcon={TrendingUp}
        emptyTitle="Нет доходов"
        emptyDescription="Добавьте первый доход, чтобы начать отслеживание"
        addLabel="Добавить доход"
        formComponent={IncomeFormWrapper}
        onDelete={deleteIncome}
        formTitle={{ create: "Новый доход", edit: "Редактировать доход" }}
      />
    </div>
  );
}
