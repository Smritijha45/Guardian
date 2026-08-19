import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, category, location_name } = body;

    const reportText = `Title: ${title || ''}\nCategory: ${category || ''}\nLocation: ${location_name || ''}\nDescription: ${description || ''}`;

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (apiKey) {
      try {
        const prompt = `You are an AI Safety Intelligence Assistant for Maharishi Markandeshwar University (MMDU), Mullana, Ambala, Haryana, India.
Analyze the following campus safety report and provide structured safety intelligence for administrative decision-making.

Report Details:
${reportText}

Respond ONLY with a raw JSON object (no markdown, no backticks) with these exact keys:
{
  "severity": "low" | "medium" | "high",
  "normalized_category": "string (e.g., Physical Hazard, Lighting Infrastructure, Suspicious Activity, Theft & Property, Harassment & Threat, Medical Emergency, General Safety)",
  "risk_reason": "string (1-2 concise sentences analyzing the safety threat and recommended dispatch urgency for campus safety officers)"
}`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2, responseMimeType: 'application/json' }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            return NextResponse.json({
              ai_severity: parsed.severity || 'medium',
              ai_category: parsed.normalized_category || category || 'General Safety',
              ai_risk_reason: parsed.risk_reason || 'Safety report analyzed for campus response.',
            });
          }
        }
      } catch (geminiError) {
        console.warn('Gemini API call warning, using campus AI heuristic fallback:', geminiError);
      }
    }

    // Heuristic Campus Safety AI Analyzer (Tailored for MMDU Mullana, Haryana context)
    const lower = `${title} ${description} ${category}`.toLowerCase();
    
    let ai_severity: 'low' | 'medium' | 'high' = 'medium';
    let ai_category = 'General Safety';
    let ai_risk_reason = 'Incident logged and evaluated for campus facilities & security review.';

    if (lower.includes('emergency') || lower.includes('blood') || lower.includes('injury') || lower.includes('assault') || lower.includes('fire') || lower.includes('weapon') || lower.includes('stalk') || lower.includes('attack')) {
      ai_severity = 'high';
      ai_category = lower.includes('injury') || lower.includes('blood') ? 'Medical Emergency' : 'Harassment & Threat';
      ai_risk_reason = 'High-risk incident presenting immediate threat to personal safety. Immediate campus security dispatch recommended.';
    } else if (lower.includes('light') || lower.includes('dark') || lower.includes('unlit') || lower.includes('lamp') || lower.includes('bulb')) {
      ai_severity = lower.includes('night') || lower.includes('hostel') ? 'high' : 'medium';
      ai_category = 'Lighting Infrastructure';
      ai_risk_reason = 'Poor visibility along campus pathway increases risk of slips or nocturnal security vulnerabilities. Dispatch electrical maintenance.';
    } else if (lower.includes('theft') || lower.includes('stolen') || lower.includes('stole') || lower.includes('lock') || lower.includes('bag') || lower.includes('laptop')) {
      ai_severity = 'medium';
      ai_category = 'Theft & Property';
      ai_risk_reason = 'Reported property theft or breach. Recommend CCTV footage review and security patrol monitoring.';
    } else if (lower.includes('wire') || lower.includes('stair') || lower.includes('hole') || lower.includes('pothole') || lower.includes('glass') || lower.includes('water') || lower.includes('leak') || lower.includes('hazard')) {
      ai_severity = lower.includes('wire') || lower.includes('electric') ? 'high' : 'medium';
      ai_category = 'Physical Hazard';
      ai_risk_reason = 'Physical environmental hazard present. Cordoning off location and notifying MMDU maintenance crew advised.';
    } else if (lower.includes('suspicious') || lower.includes('unauthorized') || lower.includes('follower') || lower.includes('stranger')) {
      ai_severity = 'high';
      ai_category = 'Suspicious Activity';
      ai_risk_reason = 'Potential unauthorized entry or suspicious behavior near campus grounds. Security escort dispatched for area sweep.';
    }

    return NextResponse.json({
      ai_severity,
      ai_category,
      ai_risk_reason,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ai_severity: 'medium',
        ai_category: 'General Safety',
        ai_risk_reason: 'Automated campus safety evaluation generated for dispatcher review.',
      },
      { status: 200 }
    );
  }
}
