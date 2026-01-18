# Mini Quiz Ambis

Aplikasi frontend React untuk platform kuis latihan subtest Ambisius Academy. Terhubung external API `https://api.quiz.ambisiusacademy.com` **tanpa database/backend lokal**. UI modern gradient TailwindCSS, responsive mobile-first.

## ✨ Features Complete
```
🔐 Authentication: Register(Email Verify) → Login(JWT) → Profile(Update/Password) → Logout
📊 Dashboard: Subtest listing + real-time session status
⏱️  Quiz Engine: Single session + countdown timer + auto-submit scoring
📈 History: Complete results + per-subtest details  
🎨 UI/UX: Tailwind gradients/blur + loading/error states + mobile-responsive
```

## 🛠️ Tech Stack
```
Frontend: React 18 + Vite 5 + TailwindCSS 3
API Client: Native Fetch + localStorage JWT
Routing: React Router (client-side)
Build: Vite (HMR + prod optimization)
Deploy: Vercel (GitHub auto-deploy)
Styling: Tailwind (responsive + custom gradients)
```

## 🚀 Local Development
```bash
git clone https://github.com/dikaariefs23/mini-quiz-ambis.git
cd mini-quiz-ambis  
npm install
npm run dev
```
**URL:** `http://localhost:5173`

**CORS Proxy** (`vite.config.js`):
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://api.quiz.ambisiusacademy.com'
    }
  }
})
```

## 📁 Repository Structure
```
mini-quiz-ambis/
├── public/                 # Static assets
├── src/
│   ├── api/               # External API clients
│   │   ├── auth.js        # register/verify/login/logout  
│   │   ├── profile.js     # get/update/changePassword
│   │   ├── dashboard.js   # subtests + status
│   │   └── quiz.js        # session/timer/submit/history
│   ├── components/        # Reusable UI components
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   └── LoadingSpinner.jsx
│   └── pages/             # Feature pages
│       ├── LoginPage.jsx
│       ├── DashboardPage.jsx
│       ├── QuizPage.jsx
│       └── ProfilePage.jsx
├── tailwind.config.js     # Custom colors/gradients
├── vite.config.js         # Proxy/build config
└── package.json
```

## 🔌 External API Endpoints
```
Authentication:
• POST /auth/register      (email verification)
• POST /auth/login         (JWT token response)  
• POST /auth/logout

Profile Management:
• GET  /profile            (user details)
• PUT  /profile            (update name/email)
• PUT  /profile/change-password

Quiz Flow:
• GET  /dashboard          (subtest list + session status)
• POST /quiz/start         (create new session)
• POST /quiz/submit        (final score submission)
• GET  /history            (results history)
```
**Production:** All `fetch('https://api.quiz.ambisiusacademy.com/...')` absolute URLs.

## ⏰ Session Management (API Constraints)
```
🔒 Single Active Session Per User Policy (anti-cheat design):
1. Login → Dashboard → "Mulai Tes" → Session ACTIVE (timer starts)
2. Timeout/Tab Close → Session EXPIRED (cannot resume)
3. Submit Success → Session LOCKED (score finalized)

📋 Solutions for Next Quiz:
• Logout → Login (fresh session)
• Register new account
• Incognito/Private mode
• DevTools: localStorage.clear() + refresh
```

## 🔧 Complete Troubleshooting
| Issue | Symptoms | Root Cause | Solutions |
|-------|----------|------------|-----------|
| **Quiz Timeout**<br>`Gak bisa klik quiz setelah expired` | Session status expired<br>Buttons disabled | API timer expired | 1. **Logout → Login**<br>2. **New account**<br>3. **Incognito mode**<br>4. `localStorage.clear()` |
| **Quiz Locked**<br>`Habis submit gak bisa test lagi` | Submit success<br>Next quiz blocked | Single session policy | 1. **Logout → Login**<br>2. **New register**<br>3. **Incognito** |
| **Login Fail** (Vercel) | POST `/auth/login` error | Relative API paths | ✅ **Fixed:** Absolute `https://api.quiz...` URLs |
| **CORS Error** (Dev) | Network `CORS policy` | Missing proxy | Copy `vite.config.js` proxy config |

```

## 📱 Production Checklist
```
✅ [ ] Register + email verify works
✅ [ ] Login → Dashboard subtests 
✅ [ ] Start quiz → timer countdown
✅ [ ] Submit → history update
✅ [ ] Profile update/password change
✅ [ ] Responsive mobile
✅ [ ] Vercel auto-deploy GitHub
```

## 🤝 Contributing Guidelines
```
1. Fork repository
2. Create feature branch: `git checkout -b feature/dark-mode`
3. Local test: `npm i && npm run dev`
4. Commit: `git commit -m "feat: add dark mode toggle"`
5. Push → Pull Request
```

Good First Issues:
- Dark mode toggle (Tailwind `dark:`)
- PWA manifest + offline support
- Multi-language (i18n)
- Session reset button UI

## 📄 License & Credits
```
MIT License © 2026 Dika Arief Sugiyatna
External API: Ambisius Academy (https://api.quiz.ambisiusacademy.com)
```

***
👨‍💻 Dika Arief Sugiyatna  
Junior Fullstack Developer | Bandung, West Java 🇮🇩  
[GitHub](https://github.com/dikaariefs23) | [Portfolio](https://dikaariefs23.github.io)

⭐ Star repo if helpful! _#react #tailwind #vite #vercel #portfolio #quizapp_
