<template>
  <div class="login-bg">
    <div class="blur-circle blur1"></div>
    <div class="blur-circle blur2"></div>
    <div class="login-card glassy">
      <h2>🔒 博客后台登录</h2>
      <form @submit.prevent="login">
        <input
          v-model="username"
          placeholder="用户名"
          autocomplete="username"
          class="login-input"
        />
        <input
          v-model="password"
          placeholder="密码"
          type="password"
          autocomplete="current-password"
          class="login-input"
        />
        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="loading">登录中…</span>
          <span v-else>立即进入</span>
        </button>
      </form>
      <div class="login-error" v-if="error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { setToken, isLoggedIn } from '@/utils/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

onMounted(() => {
  if (isLoggedIn()) router.replace('/')
})

async function login() {
  error.value = ''
  loading.value = true
  try {
    const res = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value })
    })
    const data = await res.json()
    if (res.ok && data.token) {
      setToken(data.token)
      router.replace('/')
    } else {
      error.value = data.error || '登录失败'
    }
  } catch (e) {
    error.value = e.message
  }
  loading.value = false
}
</script>

<style scoped>
.login-bg {
  min-height: 100vh;
  background: linear-gradient(120deg, #4f8cff 0%, #74f2ce 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: background 0.3s;
}
.blur-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(64px);
  opacity: 0.55;
  pointer-events: none;
  z-index: 0;
}
.blur1 {
  width: 420px; height: 380px;
  background: #2563eb77;
  left: -120px; top: -120px;
  animation: floatBlur 12s infinite linear;
}
.blur2 {
  width: 320px; height: 320px;
  background: #15f1ff88;
  right: -80px; bottom: -80px;
  animation: floatBlur2 14s infinite linear;
}
@keyframes floatBlur {
  0% { transform: translateY(0) scale(1);}
  60% { transform: translateY(44px) scale(1.1);}
  100% { transform: translateY(0) scale(1);}
}
@keyframes floatBlur2 {
  0% { transform: translateY(0) scale(1);}
  40% { transform: translateY(-34px) scale(0.98);}
  100% { transform: translateY(0) scale(1);}
}

.login-card {
  position: relative;
  z-index: 1;
  min-width: 340px;
  padding: 2.2em 2.8em 2.6em;
  border-radius: 1.5em;
  text-align: center;
  color: var(--text-color-base, #1e293b);
  box-shadow: 0 4px 32px #2563eb33;
  border: 1.5px solid var(--border-color, #b1cbf7);
  /* 炫酷磨砂 */
  background: rgba(255,255,255,0.38);
  backdrop-filter: blur(18px) saturate(1.25);
  -webkit-backdrop-filter: blur(18px) saturate(1.25);
  transition: background 0.32s, color 0.32s, border 0.32s;
}
.dark .login-card {
  background: rgba(35,45,58,0.43);
  border: 1.5px solid #304e72;
}

h2 {
  color: var(--primary-color, #2563eb);
  font-weight: 700;
  font-size: 1.7em;
  margin-bottom: 2em;
  letter-spacing: 0.05em;
  transition: color 0.3s;
  text-shadow: 0 3px 16px #328efc23;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.1em;
}

.login-input {
  padding: 0.92em 1.2em;
  font-size: 1.15em;
  border-radius: 0.95em;
  border: 1.6px solid var(--input-border, #89bcff);
  outline: none;
  background: var(--input-bg, rgba(255,255,255,0.55));
  color: var(--input-text, #212d48);
  font-weight: 500;
  box-shadow: 0 2px 10px #4f8cff09;
  transition: border 0.2s, background 0.22s, color 0.22s;
}
.login-input:focus {
  border-color: var(--primary-color, #2563eb);
  background: var(--input-bg-focus, #fff);
}
.dark .login-input {
  background: rgba(25,32,38,0.5);
  color: #dbeafe;
  border: 1.5px solid #3b82f6;
}

.login-btn {
  margin-top: 0.7em;
  padding: 0.85em 0;
  font-size: 1.15em;
  font-weight: 600;
  background: linear-gradient(90deg, #09c6f9 5%, #2563eb 70%);
  color: #fff;
  border: none;
  border-radius: 1.2em;
  cursor: pointer;
  box-shadow: 0 2px 20px #1e40af13, 0 1px 0 #fff2;
  letter-spacing: 0.06em;
  transition: background 0.2s, color 0.2s, transform 0.16s;
  position: relative;
  overflow: hidden;
}
.login-btn:hover:not(:disabled) {
  background: linear-gradient(90deg, #007cf0 20%, #38cfff 100%);
  color: #fff;
  transform: scale(1.03) rotate(-1deg);
}
.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-error {
  color: var(--error-color, #ef4444);
  margin-top: 1.1em;
  font-size: 1.07em;
  min-height: 1.3em;
  transition: color 0.3s;
  text-shadow: 0 1px 4px #e80c1e11;
}

@media (max-width: 600px) {
  .login-card {
    min-width: 0;
    width: 100%;
    padding: 1.4em 0.8em 2.2em;
    border-radius: 1em;
  }
  h2 { font-size: 1.16em; }
}

</style>
