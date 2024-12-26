
const chatServer = "192.168.0.15:8883";
const apiServer = "http://192.168.0.15:3045/graphql";
var client;
var sendButton;
var inputField;
var chatBody;
var clientId = "";
var senderId = "";
var receiverId = "";

var chatScreen = null;
var chatBotIcon = null;
var chatHeader = null;
var chatMail = null;
var chatBody = null;
var chatInput = null;
var chatSesson = null;
var chatOverlay = null;

var widgetChatBot = null;
// class chatTemplate{

// }
// const chatTemplate = chatTemplate();
const chatService = new ChatService();

class ChatWidget {
    constructor(config) {
        document.addEventListener('DOMContentLoaded', this.initialize.bind(this));
        this.config = {
            mqtt: config.mqtt || null,
            apiKey: config.apiKey || null,
            chatScreen: config.chatScreen || null,
            secretKey: config.secretKey || null,
            position: config.position || "bottom-right",
            title: config.title || "Chat with us",
            themeColor: config.themeColor || "#007BFF",
            onMessage: config.onMessage || (() => { }),
            onError: config.onError || (() => { }),
        };
        this.init();
    }

    init() {
        if (this.config.apiKey == null ||
            this.config.secretKey == null
        ) {
            this.config.onError("Required api_key and secret_key, please check your register account.");
        } else {
            chatService.onInit(
                this.config.mqtt,
                this.config.onSuccess,
                this.config.onError,
                this.onMessage,
                {
                    apiKey: this.config.apiKey,
                    secretKey: this.config.secretKey
                }
            );
            chatBotIcon = this.getChatBotIcon();
            chatHeader = this.getChatHeader();
            chatScreen = this.getChatScreen(this.config.chatScreen);
            chatMail = this.getChatMail();
            chatBody = this.getChatBody();
            chatInput = this.getChatInput();
            chatSesson = this.getChatSesson();
            chatOverlay = this.getChatOverlay();
            this.createChat();
            this.createStyles();
            this.createWidget();
            //this.setupEventListeners();
        }
    }
    getChatScreen(chatScreenName) {
        var chatScreen = document.getElementsByClassName(chatScreenName);
        return chatScreen;
    }
    getChatBotIcon() {
        const chatBotIcon =
            // '<img src="img/we-are-here.svg"/>' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-message-square animate"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x "><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        return chatBotIcon
    }
    getChatHeader() {
        const chatHeader =
            '<div class="chat-header-title">Let’s chat? - Wre online</div>' +
            '<div class="chat-header-option hide">' +
            '<span class="dropdown custom-dropdown">' +
            '<a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
            '    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-horizontal"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>' +
            '</a>' +
            '<div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuLink1" style="will-change: transform;">' +
            '    <a class="dropdown-item" href="javascript:void(0);">' +
            '         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bc32ef" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>' +
            '         Send Transcriptions' +
            '     </a>' +
            '     <a class="dropdown-item end-chat" href="javascript:void(0);">' +
            '         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bc32ef" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-power"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>' +
            '         End Chat' +
            '     </a>' +
            '  </div>' +
            '</span>' +
            '</div>';
        // `;
        return chatHeader;
    }
    getChatMail() {
        var chatMail =
            ' <div class="row">' +
            '    <div class="col-md-12 text-center mb-2">' +
            '        <p>Hi 👋! Please fill out the form below to start chatting with the next available agent.</p>' +
            '    </div>' +
            '</div>' +
            '<div class="row">' +
            '    <div class="col-md-12">' +
            '        <div class="form-group">' +
            '            <input type="text" class="form-control" placeholder="Name">' +
            '        </div>' +
            '   </div>' +
            '   <div class="col-md-12">' +
            '       <div class="form-group">' +
            '           <input type="email" class="form-control" placeholder="Email">' +
            '       </div>' +
            '   </div>' +
            '   <div class="col-md-12">' +
            '           <select class="form-control  select2_el">' +
            '               <option selected="selected">Select Option</option>' +
            '               <option>Report Abuse</option>' +
            '               <option>Other</option>' +
            '           </select>' +
            '   </div>' +
            '   <div class="col-md-12">' +
            '       <button class="btn btn-primary btn-rounded btn-block">Start Chat</button>' +
            '   </div>' +
            '  <div class="col-md-12">' +
            '      <div class="powered-by">Powered by morecambodia.com</div>' +
            '  </div>' +

            ' </div>';
        return chatMail;
    }
    getChatBody() {
        var chatBody =
            '<div class="chat-start">Monday, 1:27 PM</div>' +
            '<div class="chat-bubble you">Welcome to our site, if you need help simply reply to this message, we are online and ready to help.</div>' +
            '<div class="chat-bubble me">Hi, I am back</div>' +
            '<div class="chat-bubble me">I just want my Report Status.</div>' +
            '<div class="chat-bubble me">As i am not getting any weekly reports nowadays.</div>' +
            '<div class="chat-bubble you">' +
            '   <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto;display: block;shape-rendering: auto;width: 43px;height: 20px;" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">' +
            '       <circle cx="0" cy="44.1678" r="15" fill="#ffffff">' +
            '           <animate attributeName="cy" calcMode="spline" keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5" repeatCount="indefinite" values="57.5;42.5;57.5;57.5" keyTimes="0;0.3;0.6;1" dur="1s" begin="-0.6s"></animate>' +
            '       </circle> <circle cx="45" cy="43.0965" r="15" fill="#ffffff">' +
            '       <animate attributeName="cy" calcMode="spline" keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5" repeatCount="indefinite" values="57.5;42.5;57.5;57.5" keyTimes="0;0.3;0.6;1" dur="1s" begin="-0.39999999999999997s"></animate>' +
            '   </circle> <circle cx="90" cy="52.0442" r="15" fill="#ffffff">' +
            '       <animate attributeName="cy" calcMode="spline" keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5" repeatCount="indefinite" values="57.5;42.5;57.5;57.5" keyTimes="0;0.3;0.6;1" dur="1s" begin="-0.19999999999999998s"></animate>' +
            '   </circle></svg>' +
            '</div>' +
            '</div>';
        return chatBody;
    }
    getChatInput() {
        var chatInput =
            '<input type="text" class="input-text" placeholder="Type a message...">' +
            '<div class="input-action-icon">' +
            '    <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-paperclip"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg></a>' +
            '   <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></a>' +
            '</div>';
        return chatInput;
    }
    getChatSesson() {

        const chatSesson = '<h5>This chat session has ended</h5>' +
            '<p>Thank you for chatting with us, If you can take a minute and rate this chat:</p>' +
            '<div class="rate-me">' +
            '<div class="rate-bubble great">' +
            '       <span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-thumbs-up"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg></span>' +
            '       Great' +
            '   </div>' +
            '   <div class="rate-bubble bad">' +
            '       <span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-thumbs-down"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg></span>' +
            '       Bad' +
            '   </div>' +
            ' </div>' +
            ' <!-- <a class="transcript-chat">Need a Transcript?</a> -->' +
            '<div class="powered-by">Powered by morecambodia.com</div>';
        return chatSesson;
    }
    getChatOverlay() {
        const chatOverlay = '<div class="chat-bubble"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto;display: block;shape-rendering: auto;width: 43px;height: 20px;" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">' +
            '<circle cx="0" cy="44.1678" r="15" fill="#000000">' +
            '   <animate attributeName="cy" calcMode="spline" keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5" repeatCount="indefinite" values="57.5;42.5;57.5;57.5" keyTimes="0;0.3;0.6;1" dur="1s" begin="-0.6s"></animate>' +
            '</circle> <circle cx="45" cy="43.0965" r="15" fill="#000000">' +
            '<animate attributeName="cy" calcMode="spline" keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5" repeatCount="indefinite" values="57.5;42.5;57.5;57.5" keyTimes="0;0.3;0.6;1" dur="1s" begin="-0.39999999999999997s"></animate>' +
            ' </circle> <circle cx="90" cy="52.0442" r="15" fill="#000000">' +
            '  <animate attributeName="cy" calcMode="spline" keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5" repeatCount="indefinite" values="57.5;42.5;57.5;57.5" keyTimes="0;0.3;0.6;1" dur="1s" begin="-0.19999999999999998s"></animate>' +
            '</circle></svg></div>';
        return chatOverlay;
    }
    createWidgetWidget() {
        const widgetChatOverlay = document.createElement("div");
        widgetChatOverlay.className = "chat-overlay hide";
        widgetChatOverlay.innerHTML = chatOverlay;
        chatScreen[0].appendChild(widgetChatOverlay);

        var widgetChatBot = document.createElement("div");
        widgetChatBot.className = "chat-bot-icon";
        widgetChatBot.innerHTML = chatBotIcon;
        widgetChatBot.addEventListener("click", () => {
            $(".chat-bot-icon").children('img').toggleClass('hide');
            $(".chat-bot-icon").children('svg').toggleClass('animate');
            $('.chat-screen').toggleClass('show-chat');
        });
        document.body.appendChild(widgetChatBot);

        const widgetHeader = document.createElement("div");
        widgetHeader.className = "chat-header";
        widgetHeader.innerHTML = chatHeader;
        chatScreen[0].appendChild(widgetHeader);

        const widgetChatMail = document.createElement("div");
        widgetChatMail.className = "chat-mail";
        widgetChatMail.innerHTML = chatMail;
        chatScreen[0].appendChild(widgetChatMail);

        const widgetChatBody = document.createElement("div");
        widgetChatBody.className = "chat-body hide";
        widgetChatBody.innerHTML = chatBody;
        chatScreen[0].appendChild(widgetChatBody);

        const widgetChatInput = document.createElement("div");
        widgetChatInput.className = "chat-input hide";
        widgetChatInput.innerHTML = chatInput;
        chatScreen[0].appendChild(widgetChatInput);

        const widgetChatSession = document.createElement("div");
        widgetChatSession.className = "chat-session-end hide";
        widgetChatSession.innerHTML = chatSesson;
        chatScreen[0].appendChild(widgetChatSession);




    }

    initialize() {
        $(".select2_el").select2({
        });
        $('.chat-mail button').click(function () {
            $('.chat-overlay').removeClass('hide');
            setTimeout(() => {
                $('.chat-overlay').addClass('hide');
                $('.chat-mail').addClass('hide');
                $('.chat-body').removeClass('hide');
                $('.chat-input').removeClass('hide');
                $('.chat-header-option').removeClass('hide');
            }, 1000);
        });
        $('.end-chat').click(function () {
            $('.chat-body').addClass('hide');
            $('.chat-input').addClass('hide');
            $('.chat-session-end').removeClass('hide');
            $('.chat-header-option').addClass('hide');
        });
        $('.input-action-icon').off('click').click(() => {
            const text = $('.input-text').val();
            if (text == '') {
                return;
            }
            //var img = '<img src="https://www.google.com/images/srpr/logo4w.png">';
            //$('.chat-body').append('<div>'+img+'</div>');
            $('.chat-body').append(this.getChatMe(text, "me"));
            $('.input-text').val('');

            // $('.chat-body').append('<div class="chat-bubble me"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto;display: block;shape-rendering: auto;width: 43px;height: 20px;" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">' +
            //     '<circle cx="0" cy="44.1678" r="15" fill="#000000">' +
            //     '   <animate attributeName="cy" calcMode="spline" keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5" repeatCount="indefinite" values="57.5;42.5;57.5;57.5" keyTimes="0;0.3;0.6;1" dur="1s" begin="-0.6s"></animate>' +
            //     '</circle> <circle cx="45" cy="43.0965" r="15" fill="#000000">' +
            //     '<animate attributeName="cy" calcMode="spline" keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5" repeatCount="indefinite" values="57.5;42.5;57.5;57.5" keyTimes="0;0.3;0.6;1" dur="1s" begin="-0.39999999999999997s"></animate>' +
            //     ' </circle> <circle cx="90" cy="52.0442" r="15" fill="#000000">' +
            //     '  <animate attributeName="cy" calcMode="spline" keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5" repeatCount="indefinite" values="57.5;42.5;57.5;57.5" keyTimes="0;0.3;0.6;1" dur="1s" begin="-0.19999999999999998s"></animate>' +
            //     '</circle></svg></div>');
            $('.chat-body').animate({
                scrollTop: $('.chat-body')[0].scrollHeight
            }, 500);
            setTimeout(() => {
                $('.chat-body').append(this.getChatMe("hi how can i help you?", "you"));
                $('.chat-body').animate({
                    scrollTop: $('.chat-body')[0].scrollHeight
                }, 500);
            }, 1000);


        });
    }
    getChatMe(text, who) {
        const chatMessageMe = '<div class="chat-bubble ' + who + '">' + text + '</div>';
        return chatMessageMe;
    }
    startChat(info) {
        console.log('start chat');
        chatService.onStartChat(info);
    }
    onClientJoinChat(info){
        chatService.onClientJoinChat(info);
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
        this.createWidgetWidget();
        return;
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
        sendButton = document.getElementById("chat-send");
        inputField = document.getElementById("chat-input");
        chatBody = document.getElementById("chat-body");

        sendButton.addEventListener("click", () => this.sendMessage(inputField, chatBody));
        inputField.addEventListener("keypress", (e) => {
            if (e.key === "Enter") this.sendMessage(inputField, chatBody);
        });
    }
    onMessage(topic, data) {
        try {
            var items = JSON.parse(data);
            console.log(items);

        } catch (err) { }
    }
    sendMessage(inputField, chatBody) {
        const message = inputField.value.trim();
        if (!message) return;
        chatService.onSendMessage(message);
        // Append the user's message
        const userMessage = document.createElement("div");
        userMessage.style.margin = "10px 0";
        userMessage.style.textAlign = "right";
        userMessage.textContent = message;
        //chatBody.appendChild(userMessage);

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


