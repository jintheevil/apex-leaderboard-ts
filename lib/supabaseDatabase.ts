import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
    'https://odhlwqkjikqukraliocq.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kaGx3cWtqaWtxdWtyYWxpb2NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODcxNDQwMjUsImV4cCI6MjAwMjcyMDAyNX0.MKjeSTN0ixg0RVtxumWLpe7HpYNQ_CZieMpB1ZhdQNo'
)