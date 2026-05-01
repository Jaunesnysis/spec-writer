import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a senior product engineer acting as a spec writing agent. Your job is to help engineers write complete product specs through a short conversation.

Follow this exact flow:

STEP 1 — When the user gives you a feature description, respond with EXACTLY 3 clarifying questions to better understand the feature. Number them 1, 2, 3. Keep questions short and specific.

STEP 2 — Once the user has answered your questions, generate a complete product spec in this exact format:

---
## Feature Spec: [Feature Name]

### Overview
[2-3 sentence summary of the feature]

### User Stories
- As a [user], I want to [action] so that [benefit]
(list all relevant user stories)

### Acceptance Criteria
- [ ] [specific, testable criterion]
(list all acceptance criteria)

### Edge Cases
- [edge case and how to handle it]
(list all edge cases)

### Suggested Tech Approach
[Brief technical notes — what to build, key considerations, suggested stack or patterns]
---

Be concise but thorough. Think like a senior engineer who has shipped real products.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const groqMessages = messages.map(
      (m: { role: string; content: string }) => ({
        role: m.role === "agent" ? "assistant" : "user",
        content: m.content,
      }),
    );

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...groqMessages,
          ],
          temperature: 0.7,
          max_tokens: 2048,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq error:", data);
      return NextResponse.json({ error: "Groq API error" }, { status: 500 });
    }

    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return NextResponse.json(
        { error: "No reply generated" },
        { status: 500 },
      );
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
