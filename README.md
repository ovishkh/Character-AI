# Character AI Chat App (a0-project)

A premium React Native mobile application built with Expo SDK 52, designed to simulate conversations with famous historical figures and celebrities. Users can choose a chat partner (like Albert Einstein or Rihanna) and engage in rich, interactive, real-time AI-powered dialogues.

---

## 🚀 Key Features

*   **Character Selection:** Choose from distinct pre-configured personalities (e.g., Albert Einstein, Rihanna) with custom profile pictures generated dynamically.
*   **Immersive AI Conversations:** Leverages custom system prompts to instruct the AI model to respond in first person, mirroring the vocabulary, personality, and expertise of the selected character.
*   **Delightful Animations:** Built-in animated `TypingIndicator` for AI response states using React Native's `Animated` library.
*   **Adaptive Chat Bubbles:** Clean and interactive message bubble layouts with distinct styling for the user and the selected character.
*   **Seamless Keyboard & Scroll Experience:** Auto-scrolling on new messages with `KeyboardAvoidingView` to maintain focus on the chat thread.

---

## 🛠️ Tech Stack & Dependencies

*   **Framework:** [Expo](https://expo.dev/) (v52.0.42) & [React Native](https://reactnative.dev/) (v0.72.6)
*   **Language:** TypeScript
*   **Navigation:** React Navigation v7 (`@react-navigation/native` & `@react-navigation/native-stack`)
*   **Icons:** Lucide React Native & Expo Vector Icons (Ionicons)
*   **Toasts/Notifications:** Sonner Native

---

## 📁 Project Structure

```text
a0-project/
├── components/
│   ├── ChatBubble.tsx         # Message styling & layout (User vs. Character)
│   └── TypingIndicator.tsx    # Animated dots indicating character is typing
├── screens/
│   └── HomeScreen.tsx         # Character selection grid & main chat screen interface
├── App.tsx                    # Navigation setup & global providers (SafeArea, Toaster)
├── index.ts                   # Expo root component registration entrypoint
├── package.json               # Scripts, dependencies, and project metadata
└── tsconfig.json              # TypeScript compilation configurations
```

---

## ⚙️ How It Works (AI Integration)

1. **Character Customization:** Characters are populated with defined roles and profile image generator URLs using:
   `https://api.a0.dev/assets/image?text=<prompt>`
2. **AI Dialogue Flow:** When a user sends a message, a `POST` request is sent to `https://api.a0.dev/ai/llm` with the conversation history and a system prompt:
   ```json
   {
     "role": "system",
     "content": "You are Albert Einstein. Respond in first person as if you are really them..."
   }
   ```
3. **Response State:** A 1-second delay simulates thought processing using the `TypingIndicator` before printing the response to the screen.

---

## 💻 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd a0-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

You can run the development server using Expo:

*   **Start development server:**
    ```bash
    npm run start
    ```
*   **Run on Android emulator/device:**
    ```bash
    npm run android
    ```
*   **Run on iOS simulator/device:**
    ```bash
    npm run ios
    ```
*   **Run on Web browser:**
    ```bash
    npm run web
    ```
