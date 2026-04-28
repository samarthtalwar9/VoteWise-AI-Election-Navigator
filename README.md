# 🗳️ VoteWise AI – Election Navigator

> **Navigating the election process, simplified and personalized by AI.**

## 1. PROJECT OVERVIEW

The election process can often feel overwhelming, complex, and filled with confusing jargon. Many potential voters—especially first-time voters and young citizens—struggle to understand registration deadlines, polling locations, and necessary documentation. 

**VoteWise AI** is a comprehensive, AI-first platform designed to solve this problem by transforming the confusing civic process into a clear, interactive, and highly personalized step-by-step journey.

---

## 2. SOLUTION

VoteWise AI provides a structured path from confusion to the ballot box:
- **Personalized Voting Journey:** Tailors steps based on age, location, and voting history.
- **Step-by-Step Guidance:** Breaks down complex requirements into simple, actionable steps.
- **Timeline Tracking:** Highlights critical deadlines for registration and election days.
- **AI-Powered Assistant:** An interactive conversational agent powered by Gemini to answer any specific civic questions instantly.

---

## 3. KEY FEATURES

- 🎯 **Personalized Journey Generation:** No more generic advice; get exactly what you need to do based on your profile.
- 📅 **Timeline and Deadlines:** Clear tracking of "what to do" and "when to do it".
- 💬 **Conversational AI Assistant:** Ask anything—from "What ID do I need?" to "Where do I vote?"
- 🌐 **Multilingual Support:** Accessibility first, with seamless switching between English and Hindi.
- ✨ **Clean and Accessible UI:** A premium, dark-mode, mobile-first glassmorphism interface.

---

## 4. ARCHITECTURE

VoteWise AI is built on a clean, modular **Agent-Based Architecture**:

- **Frontend:** A responsive, state-driven React application handling the UI, state, and Firebase Auth.
- **Backend:** A robust Express.js API acting as an orchestrator.
- **Agent-Based System:**
  - 🗺️ **Guidance Agent:** Analyzes user demographics to determine the exact next step.
  - ⏱️ **Timeline Agent:** Contextualizes the next step with real-world deadlines.
  - 🤖 **Query Agent:** A dedicated conversational agent handling free-form Q&A with deep civic context.

---

## 5. Google Services Integration

- Google AI Studio (Gemini API) used for reasoning and decision making
- Firebase used for authentication and Firestore database
- Google Cloud Run used for scalable backend deployment

---

## 6. TECH STACK

- **Frontend:** React, Vite, Vanilla CSS (Glassmorphism UI)
- **Backend:** Node.js, Express.js
- **AI:** Google GenAI SDK (`@google/genai`), Gemini 2.5 Flash
- **Cloud Services:** Google Cloud Run, Firebase (Auth, Hosting, Firestore)
- **Testing:** Jest, Supertest

---

## 7. HOW IT WORKS (DEMO FLOW)

1. **User enters details:** Age, location, and voting status via a clean onboarding form.
2. **AI generates journey:** The *Guidance Agent* instantly processes the data to return an actionable next step.
3. **Timeline displayed:** The *Timeline Agent* appends crucial deadlines specific to the user's location.
4. **User asks question:** The user queries the chat interface (e.g., "Do I need a driver's license?").
5. **AI responds:** The *Query Agent* uses the user's context to provide a simple, accurate answer.

---

## 8. SECURITY & EFFICIENCY

- 🔒 **Firebase Authentication:** All API endpoints are protected by an `auth.middleware.js` that verifies Firebase ID tokens.
- 🛡️ **Input Validation:** Strict type-checking and boundary validations ensure data integrity.
- 🔑 **API Key Protection:** `GEMINI_API_KEY` and Firebase credentials are kept exclusively in environment variables and Cloud Run secrets.
- ⚡ **Optimized Gemini Calls:** Built-in caching (`journeyCache`) prevents redundant API calls for identical demographic profiles.
- ⚙️ **Robust JSON Parsing:** A dedicated utility guarantees the backend safely extracts JSON from the AI, even if markdown blocks are generated.

---

## 9. TESTING

- ✅ **Unit Tests for APIs:** Comprehensive coverage for `/api/journey` and `/api/chat` using Jest and Supertest.
- 🚨 **Edge Case Handling:** Strictly tested for underage users (< 18), invalid data, and missing payloads.

---

## 10. ACCESSIBILITY

- 📱 **Mobile-First Design:** Fully responsive layout ensuring access on any device.
- 🗣️ **Simple Language:** Prompt engineering guarantees beginner-friendly, jargon-free AI responses.
- 🌍 **Multilingual Support:** Built-in localization (English/Hindi).

---

## 11. SETUP INSTRUCTIONS

### Run Locally

1. **Clone the repo:** `git clone <repo-url>`
2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create a .env file and add your GEMINI_API_KEY and PORT=5000
   npm run dev
   ```
3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Deployment
- **Backend:** Deployed statelessly via Google Cloud Run (`gcloud run deploy`).
- **Frontend:** Deployed via Firebase Hosting (`firebase deploy`). *(See `deployment_guide.md` for full instructions)*.

---



## 12. FUTURE IMPROVEMENTS

- 🌐 Add support for 10+ regional languages.
- 🧑‍💻 Advanced personalization utilizing historical voting records.
- 🔗 Direct integration with official state and local election APIs for real-time polling data.
