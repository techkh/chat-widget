var _dataStarChat = null;
var _subSender = null;
var _receiver = null;
var _dataJoin = null;
let audio = null;


class ChatService {
    generateUUID() { // Public Domain/MIT
        var d = new Date().getTime();//Timestamp
        var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16;//random number between 0 and 16
            if (d > 0) {//Use timestamp until depleted
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            } else {//Use microseconds since page-load if supported
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
    onInit(mqtt, onError, onSuccess, onMessage, chatConfig) {
        this.onSuccess = onSuccess || (() => { });
        this.onError = onError || (() => { });
        this.onMessage = onMessage || (() => { });
        this.chatConfig = chatConfig;
        const options = {
            clientId: this.generateUUID(),
            clean: true,
            username: this.chatConfig.apiKey || '',
            password: this.chatConfig.secretKey || '',
            connectTimeout: 4000,
            reconnectPeriod: 1000,
        };
        client = mqtt.connect("ws://" + chatServer, options);

        client.on("connect", () => {
            this.onSuccess({ status: "connect", message: "success" });
        });
        client.on('connected', function () {
            this.onSuccess({ status: "connected", message: "success" });
        });
        // Event: When the client reconnects
        client.on('reconnect', () => {
            console.log('MQTT Client Reconnecting...');
        });
        // Event: When the client is offline
        client.on('offline', () => {
            console.log('MQTT Client Offline');
        });
        // Event: When the connection is closed
        client.on('close', () => {
            console.log('MQTT Client Disconnected');
        });
        // Event: When an error occurs
        client.on('error', (error) => {
            const message = 'Connection error: ' + error.message;
            if (error.message.includes('Not authorized')) {
                this.onError({ status: "error", message: message });
            }
        });
        client.on("message", (topic, message) => {
            this.onMessage(topic, message);
        })
    }
    onPlaySound(){
        if (!audio) {
            audio = new Audio('https://onlinetestcase.com/wp-content/uploads/2023/06/100-KB-MP3.mp3');
            audio.loop = true; // Enable looping
            audio.play().catch((error) => console.error('Error playing audio:', error));
            setTimeout(() => {
                //this.onStopSound();
            }, 2000);
        }

        //const audio = new Audio('https://onlinetestcase.com/wp-content/uploads/2023/06/100-KB-MP3.mp3');
        //audio.play();
    }
    onStopSound(){
        if (audio) {
            audio.pause();
            audio.currentTime = 0; // Reset the sound to the beginning
            audio = null;
        }
    }
    onClientJoinChat(user_info) {
        if (client.connected) {
            try {
                axios.post(apiServer, {
                    query: `mutation client_join_group(
                                $user_info: JSON!
                            ) {
                                client_join_group(
                                    group_id: 2,
                                    user_info: $user_info
                                )
                            }`,
                    variables: {
                        user_info: JSON.stringify(user_info),
                    },
                }, {
                    headers: {
                        'secret-key': this.chatConfig.secretKey,
                        'api-key': this.chatConfig.apiKey
                    }
                }).then(response => {
                    const data = response.data.data;
                    console.log(data);
                    _dataJoin = data;
                    this.subscribe(_dataJoin.client_join_group.channel);
                }).catch(function (thrown) {
                    console.log(thrown);
                });
            } catch (err) {
                this.onError({ status: "error", message: "Something when wrong." });
            }
        }
    }
    onStartChat(info) {
        if (client.connected) {
            try {
                axios.post(apiServer, {
                    query: `mutation start_chat(
                            $reciver_profile: JSON!, 
                            $sender_profile: JSON!,
                            ) {
                                start_chat(
                                    reciver_profile: $reciver_profile, 
                                    sender_profile: $sender_profile
                                ){
                                    chats_id
                                    name
                                    provider_id
                                    status
                                    is_group
                                    receiver{
                                        chat_user_id
                                        first_name
                                        last_name
                                        photo
                                        provider_id
                                        provider_user_id
                                        user_hash
                                    }
                                    sender{
                                        chat_user_id
                                        first_name
                                        last_name
                                        user_hash
                                        photo
                                        provider_id
                                        provider_user_id
                                    }
                                    provider{
                                        provider_hash
                                        provider_id
                                    }
                                }
                            }`,
                    variables: {
                        reciver_profile: JSON.stringify(info.reciver_profile),
                        sender_profile: JSON.stringify(info.sender_profile)
                    }
                }, {
                    headers: {
                        'secret-key': this.chatConfig.secretKey,
                        'api-key': this.chatConfig.apiKey
                    }
                }).then(response => {
                    _dataStarChat = response.data.data;
                    console.log(_dataStarChat);
                    this.onSubscribe();
                }).catch(function (thrown) {
                    console.log(thrown);
                });

            } catch (error) {
                console.error(error);
            }

        } else {
            this.onError({ status: "error", message: "Client is not connected" });
        }
    }
    onSendMessage(message) {
        if (client.connected) {
            client.publish(_receiver, JSON.stringify({ message: message }));
        }

        // try {
        //     axios.post(apiServer, {
        //         query: `mutation send_msessage(
        //                     $reciver_hash: String!, 
        //                     $sender_hash: String!,
        //                     $chats_id: Int!,
        //                     $message: String!,
        //                     $message_type: String!,
        //                     ) {
        //                         send_msessage(
        //                             reciver_hash: $reciver_hash, 
        //                             sender_hash: $sender_hash,
        //                             chats_id: $chats_id,
        //                             message: $message,
        //                             message_type: $message_type,
        //                         )
        //                     }`,
        //         variables: {
        //             reciver_hash: "a281f8f0b21c11ef8d49957083969279",
        //             sender_hash: 'b01efb20b22111efb86fbb79efaf2479',
        //             chats_id: 1,
        //             message: "how are you boy",
        //             message_type: 'text'
        //         }
        //     }, {
        //         headers: {
        //             'secret-key': '9c2abca973f041e18316173769c4402b',
        //             'api-key': '2f8900a0b18111ef97ce23c1b9f816c8'
        //         }
        //     }).then(response => {
        //         //console.log(response);
        //     }).catch(function (thrown) {
        //         console.log(thrown);
        //     });

        // } catch (error) {
        //     console.error(error);
        // }
    }
    subscribe(channel){
        this.onPlaySound();
        if(_dataJoin != null){
            client.subscribe(channel, (err) => {
                if (!err) {
                    client.publish(channel, JSON.stringify({ a: "Hi chat"+channel}));
                } else {
                    console.log(err);
                }
            });
        }
    }
    onSubscribe() {
        if (_dataStarChat != null) {
            var senderHash = _dataStarChat.start_chat.sender.user_hash;
            var receiverHash = _dataStarChat.start_chat.receiver.user_hash;
            _subSender = _dataStarChat.start_chat.provider_id + "/chat/" + senderHash + ":" + receiverHash;
            _receiver = _dataStarChat.start_chat.provider_id + "/chat/" + receiverHash + ":" + senderHash;
            client.subscribe(_subSender, (err) => {
                if (!err) {
                    console.log('subscribed');
                    client.publish(_receiver, JSON.stringify({ a: "Hi chat" }));
                } else {
                    console.log(err);
                }
            });
        }
    }
}