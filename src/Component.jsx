import React, { useState } from "react";
import axios from "axios";

const AIChatbot = () => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputText.trim()) return;

    setMessages((prev) => [...prev, { text: inputText, sender: "user" }]);
    setLoading(true);
    setInputText("");

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCagKQaEpKeXqTyUxAg4xAOb3FCeRM8kVw",
        {
          contents: [
            {
              parts: [{ text: inputText }],
              role: "user",
            },
          ],
        }
      );

      const reply =
        response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response";

      setMessages((prev) => [...prev, { text: reply, sender: "ai" }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "❌ Error: Unable to get response.", sender: "ai" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="md:bg-white w-full h-[100svh]">
      <div className="w-full md:w-xl mx-auto flex flex-cols justify-center  items-center md:pb-4  bg-white  h-full">
        <div className="flex-1 px-2 mb-20 overflow-y-auto hide-scrollbar space-y-2  md:px-2">
          <div className="items-center flex-col mt-20 gap-5 flex w-full h-[20vh]">
            <h1 className="text-3xl font-bold text-gray-800">
              Hello, I am AlphaMind.
            </h1>
            <p className="text-gray-500">Ask me something</p>
          </div>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl break-words max-w-[80%] text-sm ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <p className="text-center text-sm text-gray-400 animate-pulse">
              Thinking...
            </p>
          )}
        </div>

        {/* Fixed form at the bottom */}
        <div className="flex fixed bottom-0 justify-center   w-full md:w-xl  bg-white  items-center">
          <form
            onSubmit={handleSubmit}
            className="  gap-2 px-4 py-3 flex justify-between items-center shadow-lg"
          >
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AIChatbot;
