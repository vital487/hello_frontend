import React from 'react';
import $ from 'jquery'
import options from './img/options.svg';
import closeImg from './img/close.svg';
import send from './img/send.png';
import user from './img/user.png';
import { getCookie, eraseCookie } from './lib';
import { UserLi } from './ChatComponents';
import OptionsPopup from './ChatComponents';
import { validateToken, getMyself, search, getRequests, getContacts, isOnline, linkApi, sendMessage, getMessages, setReceiveMessages, setReadMessages, searchById } from './ajax';
import UserInfo from './UserInfo'
import ChatContactList from './ChatContactList'
import MessageScreen from './MessageScreen';
import io from 'socket.io-client';

//Number of messages to pull from server at the beggining
export const MESSAGE_NUMBER = 50

//https://flatuicolors.com/palette/se

class ChatScreen extends React.Component {
    constructor(props) {
        super(props);

        this.handleClickOptions = this.handleClickOptions.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.closeSearch = this.closeSearch.bind(this);
        this.addPopup = this.addPopup.bind(this);
        this.removePopup = this.removePopup.bind(this);
        this.getRequests = this.getRequests.bind(this);
        this.handleMessageContactSearch = this.handleMessageContactSearch.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.onChangeMessage = this.onChangeMessage.bind(this);
        this.disconnectSocket = this.disconnectSocket.bind(this);
        this.contactAction = this.contactAction.bind(this);
        this.onScroll = this.onScroll.bind(this);

        //Ref to UserInfo component
        this.userInfo = React.createRef()
        //Ref to ChatContactList component
        this.chatContactList = React.createRef()
        //Ref to MessageScreen component
        this.messageScreen = React.createRef()
        //Select user to talk to
        this.selectedUser = {}
        //Web socket connected to API
        this.socket = null;
        //Info about the authenticated user
        this.myself = null;

        getMyself()
            .then(response => {
                this.myself = response;
            })
            .catch(response => { });

        this.state = {
            /**
             * Popup que está a ser apresentado
             */
            popup: null,
            /**
             * Lista a ser apresentada na barra lateral do lado direito
             */
            sidebarList: [],
            /**
             * true se a barra lateral estiver visível ou false se não estiver
             */
            sidebarVisible: false,
            /**
             * Título da barra lateral
             */
            sidebarTitle: "Resultados"
        };
    }

    render() {
        let searchBar = null;
        document.body.style.backgroundColor = '#fff';

        if (this.state.sidebarVisible) {
            searchBar = (
                <div>
                    <div id="chat-search-close">
                        <img id="chat-search-close-img" alt="" src={closeImg} onClick={this.closeSearch} />
                        <span id="chat-search-close-text">{`${this.state.sidebarTitle} ${this.state.sidebarList.length}`}</span>
                    </div>
                    <div>
                        {this.state.sidebarList}
                    </div>
                </div>
            );
        }

        return (
            <div>
                <div>
                    {this.state.popup}
                </div>
                <div id="navbar">
                    <div id="navbar-title">
                        <span id="navbar-title-text">Conversas</span>
                        <img alt="" id="navbar-title-img" src={options} onClick={this.handleClickOptions} />
                    </div>
                    <div id="navbar-chat-info">
                        <UserInfo ref={this.userInfo} />
                    </div>
                    <div id="navbar-chat-search">
                        <input id="navbar-chat-search-input" type="text" placeholder="Pesquisar" onChange={this.handleSearch} />
                    </div>
                </div>

                <div id="app">
                    <div id="chat-list">
                        <ChatContactList ref={this.chatContactList} setMessages={(selectedUser, messages) => this.setMessages(selectedUser, messages)} />
                    </div>
                    <div id="chat">
                        <div id="chat-messages" onScroll={this.onScroll}>
                            <MessageScreen ref={this.messageScreen} />
                        </div>
                        <div id="chat-add-message">
                            <input id="chat-add-message-input" type="text" placeholder="Mensagem" maxLength={1000} onFocus={this.onFocusMessage} onKeyUp={(key) => this.onChangeMessage(key)} />
                            <img alt="Enviar" id="chat-add-message-img" src={send} onClick={this.sendMessage} />
                        </div>
                    </div>
                    <div id="chat-search">
                        {searchBar}
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        //Verify if token is validy
        let token = getCookie("token");

        if (token == null) {
            this.props.history.push("/");
        }
        else {
            validateToken(token)
                .then(response => {
                })
                .catch(response => {
                    eraseCookie("token");
                    this.props.history.push("/");
                });
        }

        //Set web socket connection with server
        this.socket = io(linkApi);

        this.socket.emit('token', getCookie('token'));

        //When socket loses connection to server
        this.socket.on('disconnect', async () => {
            this.socket = this.socket.open();
            this.socket.emit('token', getCookie('token'));
        });

        //Function when message sent to us
        this.socket.on('message', (message) => {
            this.chatContactList.current.addMessages(message.from_id, [message], true);
            this.chatContactList.current.changeLastMessage(message.from_id, message);

            if (this.selectedUser.id === message.from_id) {
                this.messageScreen.current.addNewMessages([message]);

                let messagesDiv = document.getElementById("chat-messages");
                
                if (messagesDiv.scrollTop >= messagesDiv.scrollHeight - messagesDiv.offsetHeight) {
                    this.scrollDownMessages();
                }
            }

            if (this.selectedUser.id === message.from_id) {
                setReadMessages({ userId: message.from_id })
                    .then(response => {
                    })
                    .catch(response => { });
            } else {
                setReceiveMessages({ userId: message.from_id })
                    .then(response => {
                    })
                    .catch(response => { });
            }

            /* let src = '/assets/notification.mp3';
            let audio = new Audio(src);
            audio.muted = false;
            audio.play()
                .then(response => { })
                .catch(response => {alert('n tocou') }); */
        });

        //Function when someone received our messages
        this.socket.on('received', (sourceId) => {
            this.chatContactList.current.modifyMessagesState(sourceId, 'received');
            if (this.selectedUser.id === sourceId) {
                this.messageScreen.current.modifyMessagesState('received');
            }
        });

        //Function when someone read our messages
        this.socket.on('read', (sourceId) => {
            this.chatContactList.current.modifyMessagesState(sourceId, 'read');
            if (this.selectedUser.id === sourceId) {
                this.messageScreen.current.modifyMessagesState('read');
            }
        });

        //Function when someone sends you contact request
        this.socket.on('contact_request', (sourceId) => {
            alert('New Request From ' + sourceId);
        });

        //Function when someone accepts your contact request
        this.socket.on('accepted_request', (sourceId) => {
            searchById(sourceId)
                .then(response => {
                    this.chatContactList.current.addContact(response);
                })

            alert('Your Request To ' + sourceId + ' Was Accepted');
        });

        //Function when someone removes your from being his contact
        this.socket.on('contact_removed', (sourceId) => {
            this.chatContactList.current.removeContact(sourceId);
        });

        this.socket.on('writing', (source) => {
            this.chatContactList.current.setWriting(source, true);
        });

        this.socket.on('stop_writing', (source) => {
            this.chatContactList.current.setWriting(source, false);
        });
    }

    /**
     * Send selected user to MessageScreen component and change nav bar information
     * @param {*} selectedUser 
     */
    setMessages(selectedUser, messages) {
        //Update nav bar data
        isOnline(selectedUser.id)
            .then(response => {
                this.userInfo.current.onChangeUser(linkApi + `/api/user/${selectedUser.id}/img`, selectedUser.name, response.online, selectedUser.id, response.lastSeen);
            })
            .catch(response => {
                this.userInfo.current.onChangeUser(linkApi + `/api/user/${selectedUser.id}/img`, selectedUser.name, false, -1, null);
            })

        //Set messages
        if (messages.length === 0) {
            getMessages({ userId: selectedUser.id, start: -1, number: MESSAGE_NUMBER })
                .then(response => {
                    //Store messages received on data structure
                    this.chatContactList.current.addMessages(selectedUser.id, response)
                    //Send read notifications
                    this.chatContactList.current.onReadingMessages(selectedUser.id)
                    //Show messages received
                    this.messageScreen.current.removeAndAddMessages(response, selectedUser)
                    this.selectedUser = selectedUser
                    this.scrollDownMessages()
                })
                .catch(response => { })
        } else {
            if (this.selectedUser.id !== selectedUser.id) {
                //Show messages received
                this.messageScreen.current.removeAndAddMessages(messages, selectedUser)
                //Send read notifications
                this.chatContactList.current.onReadingMessages(selectedUser.id)
                this.selectedUser = selectedUser
                this.scrollDownMessages()
            }
        }

        document.getElementById('chat-add-message-input').focus();
    }

    /**
     * Scroll down messages div
     */
    scrollDownMessages() {
        $("#chat-messages").scrollTop($("#chat-messages")[0].scrollHeight - $("#chat-messages")[0].offsetHeight);
    }

    onScroll() {
        if (typeof this.selectedUser.id === 'number' && $("#chat-messages").scrollTop() === 0) {
            //scroll height before adding new messages
            let oldHeight = $("#chat-messages")[0].scrollHeight;
            getMessages({ userId: this.selectedUser.id, start: this.chatContactList.current.getLastMessageId(this.selectedUser.id), number: MESSAGE_NUMBER })
                .then(response => {
                    if (response.length > 0) {
                        //Store messages received on data structure
                        this.chatContactList.current.addMessagesToStart(this.selectedUser.id, response)
                        //Show messages received
                        this.messageScreen.current.addOldMessages(response)
                        
                        //scroll height after adding new messages
                        let newHeight = $("#chat-messages")[0].scrollHeight;

                        $("#chat-messages").scrollTop(newHeight - oldHeight);                        
                    }
                })
                .catch(response => { });
        }
    }

    onChangeMessage(key) {
        if (document.getElementById('chat-add-message-input').value.trim() === '') {
            if (this.myself != null && typeof this.selectedUser.id !== 'undefined') {
                this.socket.emit('stop_writing', { myself: this.myself.id, destination: this.selectedUser.id });
            }
        }

        if (key.key === "Enter") {
            this.sendMessage();

            if (this.myself != null && typeof this.selectedUser.id !== 'undefined') {
                this.socket.emit('stop_writing', { myself: this.myself.id, destination: this.selectedUser.id });
            }
        }
        else if (document.getElementById('chat-add-message-input').value.trim() !== '' && this.myself != null && typeof this.selectedUser.id !== 'undefined') {
            this.socket.emit('writing', { myself: this.myself.id, destination: this.selectedUser.id });
        }

    }

    sendMessage() {
        if (typeof this.selectedUser.id !== 'undefined') {
            let message = document.getElementById('chat-add-message-input').value.trim();
            document.getElementById('chat-add-message-input').value = "";

            if (message === '') {
                return;
            }

            sendMessage({ userId: this.selectedUser.id, message: message })
                .then(response => {
                    this.chatContactList.current.addMessages(this.selectedUser.id, [response])
                    this.chatContactList.current.changeLastMessage(this.selectedUser.id, response)
                    this.messageScreen.current.addNewMessages([response])
                    this.scrollDownMessages()
                })
                .catch(response => {
                    alert('Já não é amigo dessa pessoa. Por isso, não pode enviar-lhe mensagens, mas ainda pode ver as mensagens enviadas.')
                });
        }
    }

    handleMessageContactSearch() {
        let name = document.getElementById('chat-list-search-input').value;

        if (this.state.messageBar) {

        } else {
            if (name.trim() === "") {
                getContacts()
                    .then(response => {
                        this.setState({ messageContactObject: response, messageBar: false });
                    })
                    .catch(response => { });
            } else {
                //PESQUISAR NO ARRAY
            }
        }
    }

    /**
     * Close search div
     */
    closeSearch() {
        document.getElementById('chat').style.width = '80vw';
        document.getElementById('chat-search').style.width = '0vw';

        this.setState({ sidebarVisible: false, sidebarList: [] });
    }

    /**
     * Handle search typing
     */
    handleSearch() {
        let name = document.getElementById("navbar-chat-search-input").value

        if (name.trim() === "") {
            this.closeSearch();
            return;
        }

        search({ name: name.trim() })
            .then(response => {
                let list = [];

                for (let i = 0; i < response.length; i++) {
                    list.push(<UserLi key={Math.random()} contactAction={(id, action) => this.contactAction(id, action)} user={response[i]} addPopup={(popup) => this.addPopup(popup)} removePopup={this.removePopup} />);
                }

                document.getElementById('chat').style.width = '60vw';
                document.getElementById('chat-search').style.width = '20vw';

                this.setState({ sidebarList: list, sidebarVisible: true, sidebarTitle: "Pesquisa" });
            })
            .catch(response => { });
    }

    /**
     * Activated when someone you accept or remove someone from your contact list
     * @param {*} id other user id
     * @param {*} action can be 'accept' or 'remove'
     */
    contactAction(id, action) {
        switch (action) {
            case 'accept': {
                searchById(id)
                    .then(response => {
                        this.chatContactList.current.addContact(response);
                    })
                break;
            }
            case 'remove': {
                this.chatContactList.current.removeContact(id)
                break;
            }
            default: {
            }
        }
    }

    /**
     * Handle options click
     */
    handleClickOptions() {
        this.setState({ popup: <OptionsPopup disconnectSocket={this.disconnectSocket} addPopup={(popup) => this.addPopup(popup)} removePopup={this.removePopup} getRequests={this.getRequests} /> });

    }

    disconnectSocket() {
        this.socket.disconnect();
    }

    /**
     * Add popup to the screen
     * @param {*} popup 
     */
    addPopup(popup) {
        this.removePopup();
        this.setState({ popup: popup });
    }

    /**
     * Remove popup
     */
    removePopup() {
        this.setState({ popup: null });
    }

    getRequests() {
        getRequests()
            .then(response => {
                let list = [];

                for (let i = 0; i < response.length; i++) {
                    response[i].photo = user;
                    list.push(<UserLi key={Math.random()} user={response[i]} addPopup={(popup) => this.addPopup(popup)} removePopup={this.removePopup} />);
                }

                document.getElementById('chat').style.width = '60vw';
                document.getElementById('chat-search').style.width = '20vw';

                this.setState({ sidebarList: list, sidebarVisible: true, sidebarTitle: "Pedidos" });
            })
            .catch(response => { });
    }
}

export default ChatScreen;