import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = "https://tvasvrjehqqspsaliyes.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2YXN2cmplaHFxc3BzYWxpeWVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNTM2NDAsImV4cCI6MjA3MDcyOTY0MH0.5sxFBnRdaKCx58aiahEkozUmsE6zUcdCas6IizV9GIE";

export const supabase = createClient(supabaseUrl, supabaseKey);
