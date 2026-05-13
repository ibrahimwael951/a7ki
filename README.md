# A7KI — Share Your Story. Feel Lighter.

> A safe and anonymous space to let out what's heavy on your mind. Tell your story, express your feelings, and find comfort knowing someone out there understands.

![A7KI Banner](/public/bannar.png)

---

##  What is A7KI?

**A7KI** is an anonymous storytelling platform that gives people a private space to speak freely, read others' stories, and feel supported — without ever revealing who they are.

Users can share difficult moments and heavy thoughts, wait for a moderation deadline, and then explore what others have shared — reacting to stories and leaving supportive comments.

---

##  Features

-  **Private Until Deadline** — Messages stay hidden until the scheduled release window
-  **Fully Anonymous** — No account needed to share your story
-  **Community Reactions & Comments** — Support others with reactions and kind words
-  **Email Notifications** — Optionally provide your email to be notified when your story goes live
-  **Feel Better** — Process difficult moments and realize you're not alone
-  **Learn from Others** — Gain perspective from real shared experiences

---

## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js](https://nextjs.org/) (TypeScript) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| **Icons** | [Lucide Icons](https://lucide.dev/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://gsap.com/) |
| **Interactive Graphics** | [Rive](https://rive.app/) |
| **Database** | [MongoDB](https://www.mongodb.com/) |
| **Authentication** | [Better Auth](https://www.better-auth.com/) |
| **HTTP Client** | [Axios](https://axios-http.com/) |
| **Date Utilities** | [Day.js](https://day.js.org/) |
| **Translate** | [GeneralTransaction](https://generaltranslation.com/) |
| **IP Country Location** | [ipinfo](https://ipinfo.io//) |
| **AI Model** | [openai/gpt-oss-120b] |

---

##  Getting Started

### Prerequisites

- Node.js `>= 18.x`
- MongoDB instance (local or [Atlas](https://www.mongodb.com/atlas))
- npm / yarn / pnpm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/a7ki.git
cd a7ki

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the root directory:

### Running Locally

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How It Works

1. **Share Your Story** — Submit your heavy thoughts anonymously. No account required.
2. **Wait for the Deadline** — Stories are reviewed and queued before each release window. Provide your email to get notified.
3. **Explore Others' Stories** — Read, react, and leave supportive comments on published stories.

---

##  Contributing

Contributions are welcome! Here's how to get started:

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
# Open a Pull Request
```

Please follow the existing code style and make sure your changes don't break any existing functionality.

---

##  License

This project is licensed under the [MIT License](LICENSE).

---

##  Acknowledgements

Built with love for everyone who needed a place to be heard.

> *"You are not alone."*