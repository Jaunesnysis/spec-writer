# Spec Writer Agent

An AI-powered agent that helps engineers write complete product specs through a short conversation.

## How It Works

1. Describe the feature you want to build in one sentence
2. The agent asks 3 clarifying questions
3. Answer them and get a full product spec instantly:
   - User stories
   - Acceptance criteria
   - Edge cases
   - Suggested tech approach
4. Copy or export the spec as a markdown file

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Groq API (Llama 3.3 70B)
- **Markdown**: react-markdown + @tailwindcss/typography

## Getting Started

1. Clone the repo

\`\`\`bash
git clone https://github.com/YOUR_USERNAME/spec-writer.git
cd spec-writer
\`\`\`

2. Install dependencies

\`\`\`bash
npm install
\`\`\`

3. Add your API key — create a `.env.local` file:

\`\`\`
GROQ_API_KEY=your_key_here
\`\`\`

4. Run the dev server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable       | Description                             |
| -------------- | --------------------------------------- |
| `GROQ_API_KEY` | Your Groq API key from console.groq.com |
