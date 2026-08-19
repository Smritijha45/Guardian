import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Ensure user profile exists or is updated upon Google sign in
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').upsert(
          {
            id: user.id,
            name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Campus Member',
            email: user.email || '',
            role: user.user_metadata?.role || 'student',
          },
          { onConflict: 'id' }
        );
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to auth page with error message if exchange failed
  return NextResponse.redirect(`${origin}/auth?error=Could%20not%20authenticate%20with%20Google`);
}
