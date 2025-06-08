// Temporary mock client - replace with real Supabase later
export const supabase = {
    from: (table: string) => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: (data: any) => Promise.resolve({ data, error: null }),
      update: (data: any) => ({
        eq: () => Promise.resolve({ data, error: null })
      }),
      upsert: (data: any) => Promise.resolve({ data, error: null })
    })
  }
  