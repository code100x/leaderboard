import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://vibbbkpdgsocdulyjfpo.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY

export const supabase = createClient(supabaseUrl, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpYmJia3BkZ3NvY2R1bHlqZnBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ4ODQ1MTYsImV4cCI6MjA0MDQ2MDUxNn0.lNFpKgqdaQDw9kAG1t4uWLxUngA1S8ezJ443h6Yg-28")
