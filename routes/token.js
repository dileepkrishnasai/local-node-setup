const express = require('express')

const router = express.Router()

// ===== Global state =====
let accessToken = null
// let refreshToken = 'initial-refresh-token' // keep if you want to simulate real flow
const REFRESH_INTERVAL_MS = 100000 // 100 seconds (mock requirement)
let refreshing = false
let lastRefreshedAt = null

// ===== Mock "auth server" call =====
// Replace this with a real HTTP POST to your auth server if desired.
async function requestNewAccessToken() {
  // Example real call (Node 18+ has fetch):
  // const res = await fetch('https://auth.example.com/oauth/token', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     grant_type: 'refresh_token',
  //     refresh_token: refreshToken,
  //   }),
  // })
  // if (!res.ok) throw new Error(`Auth error: ${res.status}`)
  // const data = await res.json()
  // return data.access_token

  // MOCK token so you can see it change:
  return `token_${Date.now()}`
}

async function refreshOnce() {
  if (refreshing) return { ok: false, message: 'Refresh already in progress' }
  refreshing = true
  try {
    const newToken = await requestNewAccessToken()
    accessToken = newToken
    lastRefreshedAt = new Date()
    return {
      ok: true,
      accessToken,
      lastRefreshedAt,
      nextRefreshAt: nextRefreshAt(),
      autoRefreshEveryMs: REFRESH_INTERVAL_MS,
    }
  } catch (err) {
    return { ok: false, message: err.message || String(err) }
  } finally {
    refreshing = false
  }
}

function nextRefreshAt() {
  if (!lastRefreshedAt) return null
  return new Date(lastRefreshedAt.getTime() + REFRESH_INTERVAL_MS)
}

// ===== Auto-refresh loop (every 5s) =====
setInterval(refreshOnce, REFRESH_INTERVAL_MS)
// kick off immediately so /token has something
refreshOnce()

// ===== APIs (exactly two) =====

// 1) Get current token + status
router.get('/token', (_req, res) => {
  res.json({
    accessToken,
    lastRefreshedAt,
    nextRefreshAt: nextRefreshAt(),
    autoRefreshEveryMs: REFRESH_INTERVAL_MS,
  })
})

// 2) Manually trigger a refresh now
router.post('/refresh', async (_req, res) => {
  const result = await refreshOnce()
  if (!result.ok) return res.status(500).json(result)
  return res.json(result)
})

router.get(
  '/lookupData',
  authMiddleware,
  async (req, res, next) => {
    await refreshOnce()
    return next()
  },
  (req, res) => res.status(200).json({
    id: '16354',
    recordType: 'customer',
    authenticated: true,
    token: req.userToken
  })
)

router.post('/validate', (req, res) => {
  const token = parseTokenFromRequest(req);
  if (!token) return res.status(400).json({ ok: false, message: 'No token provided' });

  const valid = token === accessToken;
  return res.json({
    ok: true,
    valid,
    reason: valid ? 'Matches current access token' : 'Does not match current access token',
    checkedAt: new Date(),
    lastRefreshedAt,
    nextRefreshAt: nextRefreshAt(),
  })
})

function authMiddleware(req, res, next) {
  const token = parseTokenFromRequest(req)
  if (!token || accessToken !== token) {
    console.log('authMiddleware: No token provided')
    return res.status(401).json({ ok: false, message: 'No token provided' })
  }
  req.userToken = token
  return next()
}

// ---- helper to read token from Authorization, body, or query
function parseTokenFromRequest(req) {
  const auth = req.headers.authorization
  console.log(`parseTokenFromRequest: ${auth} accessToken: ${accessToken}`)
  if (auth && typeof auth === 'string' && auth.toLowerCase().startsWith('bearer ')) {
    return auth.slice(7).trim()
  }
  if (req.body && typeof req.body.token === 'string') return req.body.token
  if (req.query && typeof req.query.token === 'string') return req.query.token
  return null;
}

module.exports = router
