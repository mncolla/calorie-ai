import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { connectDB } from './config/database.js'
import { analyzeImage, getMeals } from './controllers/mealController.js'

const app = new Hono()

app.use('/*', cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.use('/uploads/*', serveStatic({ root: '.' }))

app.post('/api/analyze', analyzeImage)
app.get('/api/meals', getMeals)

const startServer = async () => {
  await connectDB()
  
  serve({
    fetch: app.fetch,
    port: 3000
  }, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  })
}

startServer().catch(console.error)