import type { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { messages } = req.body
  if (!messages || messages.length === 0) {
    return res.status(400).json({ error: "No messages provided" })
  }

  const lastMessage = messages[messages.length - 1].content

  try {
    await axios.get("http://localhost:11434")

    const aiResponse = await axios.post("http://localhost:11434/api/generate", {
      model: "gemma2:latest",
      prompt: lastMessage,
      stream: false,
    })

    const aiMessage = aiResponse.data.response

    res.status(200).json({ content: aiMessage })
  } catch (error: any) {
    console.error("Error in chat API:", error.message)

    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        error: "Ollama is not running. Please make sure the service is active.",
      })
    }

    res
      .status(500)
      .json({ error: "An error occurred while processing the request" })
  }
}
