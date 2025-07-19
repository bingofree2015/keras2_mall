<template>
  <div class="ai-chat-layout">
    <div class="ai-chat-container">
      <div class="chat-header">AI 智能对话</div>
      <div class="chat-history" ref="historyRef">
        <div
          v-for="(msg, idx) in currentSession()?.messages || []"
          :key="idx"
          :class="['chat-bubble', msg.role]"
        >
          <span>{{ msg.content }}</span>
        </div>
        <div v-if="loading" class="chat-bubble ai">
          <span>AI 正在思考...</span>
        </div>
      </div>
      <div class="chat-input-bar">
        <input
          v-model="input"
          @keyup.enter="send"
          placeholder="请输入您的问题..."
          class="chat-input"
          :disabled="loading"
        />
        <button v-if="!loading" @click="send" class="chat-send-btn" :disabled="loading">
          发送
        </button>
        <button v-else @click="cancel" class="chat-cancel-btn">取消</button>
      </div>
    </div>
    <aside class="chat-sessions">
      <button class="new-session-btn" @click="newSession">+ 新对话</button>
      <ul>
        <li
          v-for="s in sessions"
          :key="s.id"
          :class="{ active: s.id === currentSessionId }"
          @click="switchSession(s.id)"
        >
          <div class="session-title">
            <span v-if="!(renamingId === s.id)">
              {{ s.name || new Date(s.created).toLocaleString().slice(5, 16) }}
            </span>
            <input
              v-else
              :id="'rename-input-' + s.id"
              v-model="renameInput"
              @keyup.enter.stop="confirmRename(s.id)"
              @blur="confirmRename(s.id)"
              class="rename-input"
              maxlength="20"
            />
            <span class="session-btn-group">
              <button class="rename-session-btn" @click.stop="startRename(s.id, s.name)">✏️</button>
              <button class="delete-session-btn" @click.stop="deleteSession(s.id)">
                <svg width="32" height="32" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M6 8v6m4-6v6m4-10v2M3 6h14M8 6V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <rect
                    x="5"
                    y="8"
                    width="10"
                    height="8"
                    rx="2"
                    stroke="currentColor"
                    stroke-width="1.6"
                  />
                </svg>
              </button>
            </span>
          </div>
          <div class="session-brief">
            {{ s.messages?.[1]?.content?.slice(0, 12) || '新会话' }}
          </div>
        </li>
      </ul>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'

type Message = { role: 'user' | 'ai'; content: string }
type Session = { id: string; created: number; name?: string; messages: Message[] }

function genId() {
  return Date.now().toString() + Math.random().toString(36).slice(2, 8)
}

const sessions = ref<Session[]>([
  {
    id: genId(),
    created: Date.now(),
    name: '',
    messages: [{ role: 'ai', content: '您好，我是AI助手，有什么可以帮您？' }],
  },
])
const currentSessionId = ref(sessions.value[0].id)
const loading = ref(false)
const input = ref('')
const historyRef = ref<HTMLElement | null>(null)
const abortController = ref<AbortController | null>(null)

const SESSIONS_KEY = 'ai_chat_sessions'
const CURRENT_ID_KEY = 'ai_chat_current_id'

const renamingId = ref('')
const renameInput = ref('')

function saveSessions() {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions.value))
  localStorage.setItem(CURRENT_ID_KEY, currentSessionId.value)
}
function loadSessions() {
  const raw = localStorage.getItem(SESSIONS_KEY)
  const id = localStorage.getItem(CURRENT_ID_KEY)
  if (raw) {
    try {
      const arr = JSON.parse(raw)
      // 补充 name 字段
      arr.forEach((s: any) => {
        if (typeof s.name !== 'string') s.name = ''
      })
      sessions.value = arr
      if (id && sessions.value.some((s) => s.id === id)) {
        currentSessionId.value = id
      } else {
        currentSessionId.value = sessions.value[0]?.id || ''
      }
    } catch {}
  }
}
watch([sessions, currentSessionId], saveSessions, { deep: true })
loadSessions()

function startRename(id: string, name: string) {
  renamingId.value = id
  renameInput.value = name || ''
  nextTick(() => {
    const input = document.getElementById('rename-input-' + id) as HTMLInputElement
    if (input) input.focus()
  })
}
function confirmRename(id: string) {
  const session = sessions.value.find((s) => s.id === id)
  if (session) session.name = renameInput.value.trim()
  renamingId.value = ''
  renameInput.value = ''
  saveSessions()
}

function currentSession() {
  // 如果找不到当前会话，返回第一个会话，如果没有会话则返回 null
  return sessions.value.find((s) => s.id === currentSessionId.value) || sessions.value[0] || null
}

async function send() {
  if (!input.value.trim() || loading.value) return
  const session = currentSession()
  if (!session) return
  session.messages.push({ role: 'user', content: input.value })
  loading.value = true
  scrollToBottom()
  input.value = ''

  abortController.value = new AbortController()
  try {
    const aiReply = await fetchDeepSeekAI(abortController.value.signal)
    const session = currentSession()
    if (session) session.messages.push({ role: 'ai', content: aiReply })
  } catch (e: any) {
    const session = currentSession()
    if (e.name === 'AbortError') {
      if (session) session.messages.push({ role: 'ai', content: '已取消本次回复。' })
    } else {
      if (session) session.messages.push({ role: 'ai', content: 'AI接口请求失败，请稍后重试。' })
    }
  } finally {
    loading.value = false
    abortController.value = null
    scrollToBottom()
  }
}

function cancel() {
  if (abortController.value) abortController.value.abort()
}

function scrollToBottom() {
  nextTick(() => {
    if (historyRef.value) {
      historyRef.value.scrollTop = historyRef.value.scrollHeight
    }
  })
}

function newSession() {
  const session = {
    id: genId(),
    created: Date.now(),
    name: '',
    messages: [{ role: 'ai', content: '您好，我是AI助手，有什么可以帮您？' }],
  }
  sessions.value.unshift(session)
  currentSessionId.value = session.id
}

function switchSession(id: string) {
  currentSessionId.value = id
}

function deleteSession(id: string) {
  const idx = sessions.value.findIndex((s) => s.id === id)
  if (idx !== -1) {
    sessions.value.splice(idx, 1)
    // 如果删除的是当前会话，切换到最新会话
    if (currentSessionId.value === id) {
      currentSessionId.value = sessions.value[0]?.id || ''
    }
  }
}

async function fetchDeepSeekAI(signal: AbortSignal): Promise<string> {
  const apiKey = 'sk-eee4aa4b5d2e4199a0c7714ef11c4d77'
  const session = currentSession()
  const history = [
    { role: 'system', content: '你是一个博物馆智能助手。' },
    ...(session?.messages || []).map((m) => ({
      role: m.role === 'ai' ? 'assistant' : m.role,
      content: m.content,
    })),
  ]
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: history,
    }),
    signal,
  })
  if (!response.ok) {
    const errText = await response.text()
    throw new Error('接口请求失败: ' + errText)
  }
  const data = await response.json()
  return data.choices?.[0]?.message?.content || 'AI未返回内容'
}
</script>

<style scoped>
.ai-chat-layout {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 1100px;
  margin: 40px auto;
  height: calc(100% - 120px);
  min-height: 400px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 16px #0002;
  overflow: hidden;
}
.ai-chat-container {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #eee;
  height: 100%;
  margin: 0;
  border-radius: 0;
  box-shadow: none;
  max-width: none;
}
.chat-sessions {
  width: 280px;
  background: #f7f8fa;
  padding: 24px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-right: none;
  border-left: 1px solid #eee;
  height: 100%;
}
.new-session-btn {
  margin: 0 16px 16px 16px;
  padding: 8px 0;
  border: none;
  background: #a60000;
  color: #fff;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
}
.chat-sessions ul {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  overflow-y: auto;
}
.chat-sessions li {
  padding: 10px 16px;
  cursor: pointer;
  border-left: 4px solid transparent;
  transition:
    background 0.2s,
    border 0.2s;
}
.chat-sessions li.active {
  background: #fff;
  border-left: 4px solid #a60000;
}
.delete-session-btn {
  background: none;
  border: none;
  color: #a60000;
  font-size: 1.1rem;
  margin-left: 8px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}
.delete-session-btn:hover {
  opacity: 1;
  color: #d32f2f;
}
.session-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.session-title {
  font-size: 0.95rem;
  color: #333;
}
.session-brief {
  font-size: 0.85rem;
  color: #888;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* 其余样式同原有 */
.chat-header {
  background: #f5f7fa;
  color: #222;
  font-weight: bold;
  font-size: 1.2rem;
  padding: 18px 24px;
  border-bottom: 1px solid #eee;
  text-align: center;
}
.chat-history {
  flex: 1;
  overflow-y: auto;
  padding: 24px 16px;
  background: #f7f8fa;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.chat-bubble {
  max-width: 80%;
  padding: 12px 18px;
  border-radius: 18px;
  font-size: 1rem;
  line-height: 1.6;
  word-break: break-word;
  box-shadow: 0 1px 4px #0001;
}
.chat-bubble.user {
  align-self: flex-end;
  background: #e6f0fa;
  color: #222;
  border-bottom-right-radius: 6px;
}
.chat-bubble.ai {
  align-self: flex-start;
  background: #f0f0f0;
  color: #333;
  border-bottom-left-radius: 6px;
}
.chat-input-bar {
  display: flex;
  align-items: center;
  padding: 16px;
  border-top: 1px solid #eee;
  background: #fafbfc;
}
.chat-input {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 1rem;
  outline: none;
  margin-right: 12px;
  background: #fff;
  transition: border 0.2s;
}
.chat-input:focus {
  border-color: #a60000;
}
.chat-send-btn {
  background: #a60000;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 22px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.chat-send-btn:hover {
  background: #b71c1c;
}
.chat-cancel-btn {
  background: #bbb;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 22px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  margin-left: 8px;
}
.chat-cancel-btn:hover {
  background: #888;
}
.rename-input {
  width: 90px;
  font-size: 0.95rem;
  padding: 2px 6px;
  border: 1px solid #aaa;
  border-radius: 4px;
  margin-right: 4px;
}
.session-btn-group {
  display: flex;
  align-items: center;
  margin-left: 8px;
  gap: 2px;
}
.rename-session-btn,
.delete-session-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 1.1rem;
  width: 24px;
  height: 24px;
  cursor: pointer;
  opacity: 0.7;
  transition:
    opacity 0.2s,
    color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.rename-session-btn:hover {
  opacity: 1;
  color: #1976d2;
}
.delete-session-btn:hover {
  opacity: 1;
  color: #d32f2f;
}
@media (max-width: 600px) {
  .ai-chat-layout {
    flex-direction: column;
    height: 80vh;
  }
  .chat-sessions {
    width: 100vw;
    flex-direction: row;
    border-right: none;
    border-bottom: 1px solid #eee;
    padding: 0 0 8px 0;
    overflow-x: auto;
    overflow-y: hidden;
  }
  .chat-sessions ul {
    display: flex;
    flex-direction: row;
    width: 100vw;
    overflow-x: auto;
    overflow-y: hidden;
  }
  .chat-sessions li {
    min-width: 120px;
    border-left: none;
    border-bottom: 4px solid transparent;
  }
  .chat-sessions li.active {
    background: #fff;
    border-bottom: 4px solid #a60000;
  }
  .ai-chat-container {
    max-width: 100vw;
    margin: 0;
    border-radius: 0;
    min-height: 200px;
  }
}
</style>
