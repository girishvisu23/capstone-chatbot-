# ANDX AI Assistant

An immersive chatbot experience for ANDX that helps traders analyze crypto markets, explore tokenization opportunities, and surface AI-driven insights. The project is built with Next.js 14 and Tailwind CSS, featuring a cinematic UI and a serverless API that proxies requests to Hugging Face hosted language models.

## Features

- Conversational UI with animated gradients, particle effects, and quick suggestion actions.
- Customizable system prompt so operators can tailor the assistant persona at runtime.
- Serverless API route that forwards chat requests to Hugging Face (`OpenAI` SDK targeting the HF Inference Router).
- Extensive Radix UI component library and theming via Tailwind CSS.
- Type-safe utilities with React 18, TypeScript 5, and modern form helpers.

## Project Structure

```
├── app               # Next.js route handlers, layouts, and pages
├── components        # UI components, chat widgets, and Radix wrappers
├── hooks             # Reusable React hooks
├── lib               # Utility helpers
├── public            # Static assets and logos
├── styles            # Global stylesheets
├── app/api/chat      # Serverless chat completion endpoint
└── package.json      # Scripts and dependencies
```

## Getting Started

Prerequisites:

- Node.js 18 or later
- npm 9+ (or your preferred package manager)

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Environment Variables

Create a `.env.local` file in the project root with the following settings:

```bash
HF_TOKEN=your_hugging_face_access_token
HF_BASE_URL=https://router.huggingface.co/v1        # optional override
HF_CHAT_MODEL=Qwen/Qwen3-Next-80B-A3B-Instruct:novita
AI_SYSTEM_PROMPT=Custom fallback system prompt
NEXT_PUBLIC_SYSTEM_PROMPT=Client-side default prompt
```

- `HF_TOKEN` is required for the Hugging Face Inference API.
- `HF_BASE_URL`, `HF_CHAT_MODEL`, and `AI_SYSTEM_PROMPT` are optional overrides.
- `NEXT_PUBLIC_SYSTEM_PROMPT` configures the initial persona exposed in the browser.

## Building for Production

```bash
npm run build
npm run start
```

## Deployment

This project targets the Next.js App Router and can be deployed to any platform that supports serverless Node.js environments, including Vercel, Netlify, and AWS Amplify. Ensure the environment variables listed above are configured in your hosting provider.

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/amazing-idea`.
3. Commit your changes and open a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file (or repository settings) for details.


