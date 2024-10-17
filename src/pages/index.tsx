import { useState } from "react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism"

interface CodeProps {
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

const CodeBlock = ({ inline, className, children, ...props }: CodeProps) => {
  const match = /language-(\w+)/.exec(className || "")

  return !inline && match ? (
    <SyntaxHighlighter
      style={oneDark}
      language={match[1]}
      PreTag="div"
      {...props}
    >
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  )
}

export default function Home() {
  const [input, setInput] = useState<string>("")
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const userMessage = { role: "user", content: input }
    const updatedMessages = [...messages, userMessage]

    setMessages(updatedMessages)
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else if (data.content) {
        const aiMessage = { role: "assistant", content: data.content }
        setMessages([...updatedMessages, aiMessage])
      } else {
        console.error("Error: AI response is empty or invalid")
      }
    } catch (error) {
      console.error("Error:", error)
      setError("Something went wrong while communicating with the AI.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-black/50 p-4">
      <div className="flex-1 overflow-y-auto px-4 flex flex-col bg-gray-800 w-full max-w-screen-md shadow-lg rounded-lg pb-2">
        {messages.length > 0 ? (
          messages.map((message, i) =>
            message.content ? (
              <div
                key={i}
                className={`mb-4 p-4 rounded-xl ${
                  message.role === "user"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-700 text-white self-start"
                }`}
                style={{
                  padding: "14px 20px",
                  margin: "10px 0",
                  borderRadius: "15px",
                  maxWidth: "75%",
                }}
              >
                {message.role === "assistant" ? (
                  <ReactMarkdown components={{ code: CodeBlock }}>
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  <p>{message.content}</p>
                )}
              </div>
            ) : null,
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-gray-400">No messages yet...</p>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center mt-4 bg-red-100 border border-red-500 text-red-700 px-4 py-3 rounded relative">
            <p className="text-center">{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center mt-4">
            <p className="text-gray-400">AI is typing...</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-800 w-full mt-4 max-w-screen-md shadow-lg rounded-lg">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
            style={{
              borderRadius: "30px",
              padding: "14px 20px",
            }}
          />
          <button
            type="submit"
            className={`px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${
              loading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  )
}
