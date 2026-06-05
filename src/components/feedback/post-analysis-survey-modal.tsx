"use client";

import { submitProductFeedback } from "@/lib/actions/feedback";
import {
  DISAPPEARANCE_OPTIONS,
  type DisappearanceId,
  type UsefulFeatureId,
  USEFUL_FEATURES,
} from "@/lib/feedback/constants";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface PostAnalysisSurveyModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const STEPS = [
  "Насколько полезным оказался FinPilot?",
  "Что оказалось самым полезным?",
  "Что было непонятно?",
  "Если FinPilot завтра исчезнет, насколько вам будет жалко его потерять?",
] as const;

export function PostAnalysisSurveyModal({
  open,
  onClose,
  onComplete,
}: PostAnalysisSurveyModalProps) {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [features, setFeatures] = useState<UsefulFeatureId[]>([]);
  const [confusion, setConfusion] = useState("");
  const [disappearance, setDisappearance] = useState<DisappearanceId | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function reset() {
    setStep(0);
    setScore(null);
    setFeatures([]);
    setConfusion("");
    setDisappearance(null);
    setError("");
  }

  function handleClose() {
    onClose();
    reset();
  }

  function toggleFeature(id: UsefulFeatureId) {
    setFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  function canNext() {
    if (step === 0) return score !== null;
    if (step === 1) return features.length > 0;
    if (step === 2) return true;
    if (step === 3) return disappearance !== null;
    return false;
  }

  async function handleSubmit() {
    if (score === null || !disappearance || features.length === 0) return;
    setLoading(true);
    setError("");
    try {
      await submitProductFeedback({
        usefulness_score: score,
        most_useful_features: features,
        confusion_text: confusion,
        disappearance_score: disappearance,
      });
      onComplete();
      handleClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Не удалось сохранить ответ"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Ваше мнение важно"
      className="max-w-md"
    >
      <p className="text-xs text-muted mb-4">
        Шаг {step + 1} из {STEPS.length}
      </p>
      <h3 className="text-sm font-medium mb-4">{STEPS[step]}</h3>

      {step === 0 && (
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setScore(n)}
              className={cn(
                "rounded-lg border py-2 text-sm font-medium transition-colors",
                score === n
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border text-muted hover:border-accent/40"
              )}
            >
              {n}
            </button>
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-2">
          {USEFUL_FEATURES.map(({ id, label }) => (
            <label
              key={id}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer transition-colors",
                features.includes(id)
                  ? "border-accent bg-accent/10"
                  : "border-border hover:border-accent/30"
              )}
            >
              <input
                type="checkbox"
                className="accent-accent"
                checked={features.includes(id)}
                onChange={() => toggleFeature(id)}
              />
              {label}
            </label>
          ))}
        </div>
      )}

      {step === 2 && (
        <textarea
          className="w-full min-h-[120px] rounded-lg border border-border bg-surface px-3 py-2 text-sm resize-y focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="Необязательно — напишите, если что-то смутило"
          value={confusion}
          onChange={(e) => setConfusion(e.target.value)}
          maxLength={2000}
        />
      )}

      {step === 3 && (
        <div className="space-y-2">
          {DISAPPEARANCE_OPTIONS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setDisappearance(id)}
              className={cn(
                "w-full text-left rounded-lg border px-3 py-2.5 text-sm transition-colors",
                disappearance === id
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted hover:border-accent/40 hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-400 mt-3">{error}</p>}

      <div className="flex justify-between gap-2 mt-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => (step > 0 ? setStep((s) => s - 1) : handleClose())}
          disabled={loading}
        >
          {step > 0 ? "Назад" : "Позже"}
        </Button>
        {step < STEPS.length - 1 ? (
          <Button
            size="sm"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext()}
          >
            Далее
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!canNext() || loading}
          >
            {loading ? "Сохранение..." : "Отправить"}
          </Button>
        )}
      </div>
    </Modal>
  );
}
