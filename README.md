# PDF Chat RAG App

A Next.js application that enables users to upload PDF files and interactively ask questions about their content using Retrieval-Augmented Generation (RAG).

## Features

- **PDF Upload:** Upload PDF documents via a simple UI.
- **Chat Interface:** Ask questions about the uploaded PDF and receive context-aware answers.
- **RAG Pipeline:** Uses retrieval-augmented generation to provide accurate, document-based responses.

## Tech Stack

- **Frontend:** Next.js + Tailwind
- **Backend:**
  1. Next.js API Routes
  2. Vercel's `ai-sdk` for chat interface
  3. Langchain for chunking
- **Vector Database:** Upstash
- **AI Model:** OpenAI
- **PDF Processing:** `pdf-parse` for text extraction

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. **Open the app:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/`
  - `components/UploadWidget.js` – PDF upload UI
  - `chat/page.js` – Chat interface
  - `api/upload/route.js` – Handles PDF uploads
  - `api/chat/route.js` – Handles chat queries and RAG logic
  - `context/AppContext.js` – App-wide context management

## How It Works

1. **Upload a PDF** using the upload widget.
2. **Ask questions** in the chat interface.
3. The backend extracts and indexes PDF content, retrieves relevant context, and generates answers using RAG.
