import { createClient } from '@supabase/supabase-js'

// Factory paresseuse : le client n'est créé qu'à l'appel, pas au module-level.
// Évite le crash au build quand SUPABASE_SERVICE_ROLE_KEY n'est pas encore renseigné.
export function getSupabaseAdmin() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY manquant dans .env.local — ' +
        'récupère-le dans Supabase Dashboard → Settings → API → service_role'
    )
  }
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
