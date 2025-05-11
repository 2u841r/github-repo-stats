// Deploy it to https://dash.deno.com/ 

// main.ts
import { Hono } from 'npm:hono'

const app = new Hono()
const kv = await Deno.openKv()

// Serve SVG counter
app.get('/:user/:repo', async (c) => {
  const { user, repo } = c.req.param()
  const key = ['counter', user, repo]

  // Increment counter
  const counter = await kv.get<number>(key)
  const newCount = (counter.value ?? 0) + 1
  await kv.set(key, newCount)

  // Return SVG
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="20">
      <rect width="120" height="20" fill="#24292e" rx="4"/>
      <text x="60" y="14" fill="#fff" font-size="12" font-family="Arial" text-anchor="middle">
        ${newCount} views
      </text>
    </svg>
  `
  c.header('Content-Type', 'image/svg+xml')
  c.header('Cache-Control', 'no-store')
  return c.body(svg)
})

Deno.serve(app.fetch)
