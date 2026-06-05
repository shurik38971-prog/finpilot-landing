"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Debt } from "@/types/database";
import { createDebt, updateDebt } from "@/lib/actions/finance";
import { useState } from "react";

interface DebtFormProps {
  debt?: Debt;
  onSuccess: () => void;
}

export function DebtForm({ debt, onSuccess }: DebtFormProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      if (debt) {
        await updateDebt(debt.id, formData);
      } else {
        await createDebt(formData);
      }
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="title"
        name="title"
        label="Название"
        defaultValue={debt?.title}
        required
        placeholder="Кредитная карта"
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="total_amount"
          name="total_amount"
          label="Общая сумма (₽)"
          type="number"
          min="0"
          step="0.01"
          defaultValue={debt?.total_amount}
          required
        />
        <Input
          id="remaining_amount"
          name="remaining_amount"
          label="Остаток (₽)"
          type="number"
          min="0"
          step="0.01"
          defaultValue={debt?.remaining_amount}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="interest_rate"
          name="interest_rate"
          label="Ставка (% годовых)"
          type="number"
          min="0"
          step="0.01"
          defaultValue={debt?.interest_rate ?? 0}
          required
        />
        <Input
          id="minimum_payment"
          name="minimum_payment"
          label="Мин. платёж (₽)"
          type="number"
          min="0"
          step="0.01"
          defaultValue={debt?.minimum_payment ?? 0}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="due_day"
          name="due_day"
          label="День платежа"
          type="number"
          min="1"
          max="31"
          defaultValue={debt?.due_day ?? undefined}
        />
        <Input
          id="priority"
          name="priority"
          label="Приоритет"
          type="number"
          min="0"
          defaultValue={debt?.priority ?? 0}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Сохранение..." : debt ? "Обновить" : "Добавить"}
      </Button>
    </form>
  );
}
