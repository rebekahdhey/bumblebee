const messageInput = document.querySelector(".message-input"); // Input field
const chatBody = document.querySelector(".chat-body"); // Message display area
const sendMessageButton = document.querySelector("#send-message");

const API_KEY = "AIzaSyAm6j5mT1d2M3i693qye_8p3B7I7ae0RLc";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const userData = {
    message: null
}

const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}

const generateBotResponse = async (thinkingMessageDiv) => {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{
            parts: [{ text: userData.message }]
            }]
        })
    };

    try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error.message);

        // Assuming the AI response is in the data structure you're using
        const apiResponseText = data.candidates[0].content.parts[0].text.trim();
        
        // Remove the thinking indicator
        chatBody.removeChild(thinkingMessageDiv);

        // Create and append the bot response message
        const botResponseContent = `<div class="message-text">${apiResponseText}</div>`;
        const incomingMessageDiv = createMessageElement(botResponseContent, "bot-message");
        chatBody.appendChild(incomingMessageDiv);

        // Scroll to the bottom of the chat
        chatBody.scrollTop = chatBody.scrollHeight;

    } catch (error) {
        console.log(error);
        // Display an error message in the chat
        const errorMessageContent = `<div class="message-text">Error: ${error.message}</div>`;
        const errorMessageDiv = createMessageElement(errorMessageContent, "bot-message");
        chatBody.appendChild(errorMessageDiv);

        // Scroll to the bottom of the chat
        chatBody.scrollTop = chatBody.scrollHeight;
    } finally {
        incomingMessageDiv.classList.remove("thinking");
    }
}

const handleOutgoingMessage = (e) => {
    // Prevent default behavior only when the button is clicked
    if (e.type === "click") {
        e.preventDefault();
    }

    userData.message = messageInput.value.trim();

    // Check if there is a message to send
    if (userData.message) {
        const messageContent = `<div class="message-text">${userData.message}</div>`;
        
        const outgoingMessageDiv = createMessageElement(messageContent, "user-message");
        chatBody.appendChild(outgoingMessageDiv);

        // Scroll to the bottom of the chat
        chatBody.scrollTop = chatBody.scrollHeight;

        // Clear the input after sending
        messageInput.value = ""; 

        // Show thinking indicator
        const thinkingMessageContent = `<img src="chat.png" alt="image">
            <div class="message-text">
                <div class="thinking-indicator">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            </div>`;
        
        const thinkingMessageDiv = createMessageElement(thinkingMessageContent, "bot-message", "thinking");
        chatBody.appendChild(thinkingMessageDiv);

        // Scroll to the bottom of the chat
        chatBody.scrollTop = chatBody.scrollHeight;

        // Call the API to get the bot response
        generateBotResponse(thinkingMessageDiv);
    }
}

// Handle Enter key press
messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault(); // Prevent default behavior of adding a new line
        handleOutgoingMessage(e);
    }
});

// Handle button click
sendMessageButton.addEventListener("click", handleOutgoingMessage);
