import express from 'express'
import { callAssistant } from './chat.js'

const app = express()
app.use(express.json());

app.post('/api/chat', async(req, res) => {
    const prompt = req.body?.prompt ?? "The user did not ask anything"
    const response = await callAssistant(prompt)
    res.json(response)
})

app.use(express.static("public"));
app.listen(3000, () => console.log(`Serving on http://localhost:3000`))