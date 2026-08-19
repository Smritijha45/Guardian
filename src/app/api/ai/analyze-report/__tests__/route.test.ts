import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '../route';

describe('AI Analyze Report API Route Tests', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('uses Gemini API when API key is provided and returns parsed structured AI safety evaluation', async () => {
    process.env.GEMINI_API_KEY = 'mock-api-key';

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    severity: 'high',
                    normalized_category: 'Lighting Infrastructure',
                    risk_reason: 'Unlit streetlight poses dark walkway hazard near Library entrance.',
                  }),
                },
              ],
            },
          },
        ],
      }),
    });

    vi.stubGlobal('fetch', mockFetch);

    const request = new Request('http://localhost:3000/api/ai/analyze-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Unlit lamp post',
        category: 'lighting',
        location_name: 'Library North',
        description: 'Dark pathway at night near Central Library',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.ai_severity).toBe('high');
    expect(data.ai_category).toBe('Lighting Infrastructure');
    expect(data.ai_risk_reason).toContain('Unlit streetlight');
  });

  it('falls back to heuristic analysis when Gemini API key is missing or call fails', async () => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    const request = new Request('http://localhost:3000/api/ai/analyze-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Exposed electrical wire hazard',
        category: 'hazard',
        location_name: 'Engineering Block',
        description: 'Dangerous electric wire on wet ground',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.ai_severity).toBe('high');
    expect(data.ai_category).toBe('Physical Hazard');
    expect(data.ai_risk_reason).toBeDefined();
  });
});
