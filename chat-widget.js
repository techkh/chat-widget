class ChatWidget {
    constructor(config) {
        this.config = {
            apiKey: config.apiKey || null,
            secretKey: config.secretKey || null,
            position: config.position || "bottom-right",
            title: config.title || "Chat with us",
            apiUrl: config.apiUrl || "https://your-backend-url.com",
            themeColor: config.themeColor || "#007BFF",
            onMessage: config.onMessage || (() => { }),
            onError: config.onError || (() => { }),
        };
        this.init();
    }

    init() {
        if (this.config.apiKey == null || this.config.secretKey == null) {
            //console.log('Required api_key and secret_key, please check your register account.');
            this.config.onError("Required api_key and secret_key, please check your register account.");
        } else {
            this.createChat();
            this.createStyles();
            this.createWidget();
            this.setupEventListeners();
        }
    }
    createChat() {
        console.log('createChat');
        this.onSubscribe();
    }
    onSubscribe() {
        console.log('onSubscribe');
    }
    createStyles() {
        const style = document.createElement("style");
        style.innerHTML = `
        #chat-widget {
          position: fixed;
          ${this.config.position.includes("bottom") ? "bottom: 20px;" : ""}
          ${this.config.position.includes("right") ? "right: 20px;" : ""}
          ${this.config.position.includes("left") ? "left: 20px;" : ""}
          width: 300px;
          height: 400px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          background: #fff;
          z-index: 10000;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          font-family: Arial, sans-serif;
        }
        #chat-header {
          background: ${this.config.themeColor};
          color: white;
          padding: 10px;
          font-size: 16px;
          font-weight: bold;
        }
        #chat-body {
          flex: 1;
          padding: 10px;
          overflow-y: auto;
        }
        #chat-footer {
          border-top: 1px solid #ddd;
          padding: 10px;
          display: flex;
          gap: 10px;
        }
        #chat-footer input {
          flex: 1;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        #chat-footer button {
          background: ${this.config.themeColor};
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 5px;
          cursor: pointer;
        }
      `;
        document.head.appendChild(style);
    }

    createWidget() {
        const widget = document.createElement("div");
        widget.id = "chat-widget";

        widget.innerHTML = `
        <div id="chat-header">${this.config.title}</div>
        <div id="chat-body"></div>
        <div id="chat-footer">
          <input type="text" id="chat-input" placeholder="Type a message...">
          <button id="chat-send">Send</button>
        </div>
      `;

        document.body.appendChild(widget);
    }

    setupEventListeners() {
        const sendButton = document.getElementById("chat-send");
        const inputField = document.getElementById("chat-input");
        const chatBody = document.getElementById("chat-body");

        sendButton.addEventListener("click", () => this.sendMessage(inputField, chatBody));
        inputField.addEventListener("keypress", (e) => {
            if (e.key === "Enter") this.sendMessage(inputField, chatBody);
        });
    }

    sendMessage(inputField, chatBody) {
        const message = inputField.value.trim();
        if (!message) return;

        // Append the user's message
        const userMessage = document.createElement("div");
        userMessage.style.margin = "10px 0";
        userMessage.style.textAlign = "right";
        userMessage.textContent = message;
        chatBody.appendChild(userMessage);

        // Clear input
        inputField.value = "";

        // Simulate backend response (replace with actual API call)
        setTimeout(() => {
            const botMessage = document.createElement("div");
            botMessage.style.margin = "10px 0";
            botMessage.style.textAlign = "left";
            botMessage.textContent = `Echo: ${message}`;
            chatBody.appendChild(botMessage);
            chatBody.scrollTop = chatBody.scrollHeight; // Auto-scroll
        }, 500);

        // Trigger callback
        this.config.onMessage(message);
    }


}

// Expose the library globally
window.ChatWidget = ChatWidget;