# Mini Quiz Ambis

Aplikasi frontend React untuk platform kuis latihan subtest Ambisius Academy. Terhubung external API `https://api.quiz.ambisiusacademy.com` **tanpa database/backend lokal**. UI modern gradient TailwindCSS, responsive mobile-first.

## ✨ Fitur Lengkap
- ✅ **Auth Flow**: Register + email verify → Login JWT → Profile update → Ganti password → Logout
- ✅ **Dashboard**: List subtest + session status (active/expired)
- ✅ **Quiz**: Single session, real-time timer, resume, submit skor otomatis
- ✅ **History**: Riwayat kuis + detail hasil per subtest
- ✅ **UI/UX**: Loading/error states, responsive, gradient blur effects

## 🛠️ Tech Stack
```
Frontend: React 18 + Vite + TailwindCSS
API:     Fetch + localStorage (JWT token)
No Backend/DB - Pure Client + External API
```

## 🚀 Quick Start
```bash
git clone https://github.com/dikaariefs23/mini-quiz-ambis.git
cd mini-quiz-ambis
npm install
npm run dev
```
**Open:** `http://localhost:5173`

**Proxy CORS dev** (`vite.config.js`):
```js
export default {
  server: {
    proxy: {
      '/api': 'https://api.quiz.ambisiusacademy.com'
    }
  }
}
```

## 📁 Struktur Folder
```
mini-quiz-ambis/
├── src/
│   ├── api/          # auth.js profile.js (external API calls)
│   ├── components/   # Layout Navbar LoadingSpinner
│   └── pages/        # ProfilePage QuizPage Dashboard History
├── public/
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## 🔗 API Endpoints
```
POST /api/auth/register    # + email verify
POST /api/auth/login       # JWT token
PUT  /api/profile          # Update name/email  
PUT  /api/profile/change-password
GET  /api/dashboard        # Subtests list
POST /api/quiz/submit      # Skor
GET  /api/history          # Results
```

## 🔧 Troubleshooting
| Issue | Solution |
|-------|----------|
| CORS Error | Tambah proxy vite.config.js |
| Token Expired | Clear localStorage → relogin |
| Password Fail | Cek old_password di Network tab F12 |
| Build Error | `rm node_modules && npm i` |
