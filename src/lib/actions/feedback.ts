"use server";

import {
  DISAPPEARANCE_OPTIONS,
  type DisappearanceId,
  type UsefulFeatureId,
  USEFUL_FEATURES,
} from "@/lib/feedback/constants";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const FEATURE_IDS = new Set(USEFUL_FEATURES.map((f) => f.id));
const DISAPPEARANCE_IDS = new Set(DISAPPEARANCE_OPTIONS.map((d) => d.id));
const MESSAGE_TYPES = new Set(["idea", "bug", "confusion"]);

async function getUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return { supabase, userId: user.id };
}

export async function hasProductFeedback(): Promise<boolean> {
  try {
    const { supabase, userId } = await getUserId();
    const { data } = await supabase
      .from("feedback")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    return data != null;
  } catch {
    return false;
  }
}

export async function submitProductFeedback(input: {
  usefulness_score: number;
  most_useful_features: UsefulFeatureId[];
  confusion_text: string;
  disappearance_score: DisappearanceId;
}) {
  const { supabase, userId } = await getUserId();

  if (
    input.usefulness_score < 1 ||
    input.usefulness_score > 10 ||
    !Number.isInteger(input.usefulness_score)
  ) {
    throw new Error("Invalid usefulness score");
  }

  if (input.most_useful_features.length === 0) {
    throw new Error("Select at least one feature");
  }

  for (const feature of input.most_useful_features) {
    if (!FEATURE_IDS.has(feature)) {
      throw new Error("Invalid feature");
    }
  }

  if (!DISAPPEARANCE_IDS.has(input.disappearance_score)) {
    throw new Error("Invalid disappearance option");
  }

  const disappearanceLabel = DISAPPEARANCE_OPTIONS.find(
    (d) => d.id === input.disappearance_score
  )!.label;

  const { error } = await supabase.from("feedback").upsert(
    {
      user_id: userId,
      usefulness_score: input.usefulness_score,
      most_useful_features: input.most_useful_features,
      confusion_text: input.confusion_text.trim() || null,
      disappearance_score: disappearanceLabel,
    },
    { onConflict: "user_id" }
  );

  if (error) throw error;
  revalidatePath("/admin");
}

export async function submitFeedbackMessage(input: {
  type: "idea" | "bug" | "confusion";
  message: string;
}) {
  const { supabase, userId } = await getUserId();
  const message = input.message.trim();

  if (!MESSAGE_TYPES.has(input.type)) {
    throw new Error("Invalid type");
  }

  if (message.length < 3 || message.length > 2000) {
    throw new Error("Invalid message length");
  }

  const { error } = await supabase.from("feedback_messages").insert({
    user_id: userId,
    type: input.type,
    message,
  });

  if (error) throw error;
  revalidatePath("/admin");
}
