import { createClient } from "@supabase/supabase-js";

export const supabaseClient = () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error("Supabase URL or Key not found");
  }

  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
  );
};
