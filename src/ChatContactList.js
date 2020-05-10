import React from 'react';
import { ContactMessage, ContactLi } from './ChatComponents';
import { getContacts, getContactMessageInfo, setReadMessages, validateToken, getContactMessageInfoId, getMessages } from './ajax';
import { getCookie } from './lib';
import { MESSAGE_NUMBER } from './ChatScreen';

class ChatContactList extends React.Component {
    constructor(props) {
        super(props)

        this.search = this.search.bind(this)

        //All messages by user
        this.messages = {};
        //All refs to the ContactMessage components
        this.chatRefs = {};
        this.myId = this.props.myId;

        this.state = {
            searchBy: '',
            selectedUser: {},
            selectedTab: 'chats',
            chatList: [],
            contactList: []
        }
    }

    render() {
        //Gera as listas a serem colocadas da barra do lado esquerdo com os chats do utilizador ou os seus contactos
        let components = [];
        this.chatRefs = {};
        if (this.state.selectedTab === 'chats') {
            //Gera a lista com a informação dos chats
            if (this.state.selectedUser != null) {
                for (let i = 0; i < this.state.chatList.length; i++) {
                    let ref = React.createRef();
                    this.chatRefs[`${this.state.chatList[i].id}`] = ref;
                    components.push(<ContactMessage key={this.state.chatList[i].id} selected={this.state.selectedUser.id === this.state.chatList[i].id ? true : false} user={this.state.chatList[i]} onUserSelected={(selectedUser, tab) => this.onUserSelected(selectedUser, tab)} ref={ref} visibility={(this.state.chatList[i].name).toLowerCase().includes(this.state.searchBy) || (this.state.chatList[i].realname).toLowerCase().includes(this.state.searchBy)} />);
                }
            } else {
                for (let i = 0; i < this.state.chatList.length; i++) {
                    let ref = React.createRef();
                    this.chatRefs[`${this.state.chatList[i].id}`] = ref;
                    components.push(<ContactMessage key={this.state.chatList[i].id} selected={false} user={this.state.chatList[i]} onUserSelected={(selectedUser, tab) => this.onUserSelected(selectedUser, tab)} ref={ref} visibility={(this.state.chatList[i].name).toLowerCase().includes(this.state.searchBy) || (this.state.chatList[i].realname).toLowerCase().includes(this.state.searchBy)} />);
                }
            }
        } else {
            //Gera a lista com a informação dos contactos
            for (let i = 0; i < this.state.contactList.length; i++) {
                if ((this.state.contactList[i].firstname + " " + this.state.contactList[i].surname).toLowerCase().includes(this.state.searchBy)) {
                    components.push(<ContactLi key={this.state.contactList[i].id} user={this.state.contactList[i]} onUserSelected={(selectedUser, tab) => this.onUserSelected(selectedUser, tab)} />);
                }
            }
        }

        return (
            <div id="chat-list">
                <div id="chat-list-search">
                    <input id="chat-list-search-input" type="text" placeholder="Pesquisar" onChange={this.search} />
                </div>
                <div id="chat-list-options">
                    <div id="chat-list-options-div1" className="chat-list-options-div">
                        <div id="chat-list-options-indiv1" className="chat-list-options-indiv" onClick={() => this.changeTab('chats')}>
                            <span className="chat-list-options-span">Conversas</span>
                        </div>
                    </div>
                    <div className="chat-list-options-div">
                        <div id="chat-list-options-indiv2" className="chat-list-options-indiv" onClick={() => this.changeTab('contacts')}>
                            <span className="chat-list-options-span">Contactos</span>
                        </div>
                    </div>
                </div>
                <div id="chat-list-list">
                    {components}
                </div>
            </div>
        )
    }

    /**
     * When component mounts, get all chats and contacts and saves them offline for further usage
     */
    componentDidMount() {
        this.changeTab('chats');

        getContactMessageInfo()
            .then(response => {
                response = this.sortChatList(response);
                this.setState({ chatList: response, selectedTab: 'chats' });
            })
            .catch(response => { });

        getContacts()
            .then(response => {
                this.setState({ contactList: response, selectedTab: 'chats' });
            })
            .catch(response => { });

        validateToken(getCookie('token'))
            .then(response => {
                this.myId = response.user.id;
            })
            .catch(response => {

            });
    }

    search() {
        let name = document.getElementById('chat-list-search-input').value.trim().toLowerCase();
        this.setState({ searchBy: name });
    }

    /**
     * Change tab
     * @param {string} tab tab that was selected
     */
    changeTab(tab) {
        let div1 = document.getElementById('chat-list-options-indiv1');
        let div2 = document.getElementById('chat-list-options-indiv2');
        document.getElementById('chat-list-search-input').value = "";

        if (tab === 'chats') {
            div1.style.backgroundColor = '#ddd';
            div2.style.backgroundColor = '#fff';

            this.setState({ selectedTab: 'chats', searchBy: '' });
        } else if (tab === 'contacts') {
            div1.style.backgroundColor = '#fff';
            div2.style.backgroundColor = '#ddd';

            this.setState({ selectedTab: 'contacts', searchBy: '' });
        }
    }

    /**
     * Puts the messages on screen from the selected user
     * @param {*} selectedUser user clicked
     * @param {*} tab tab which element belonged
     */
    onUserSelected(selectedUser, tab) {
        if (tab === 'contacts') this.changeTab('chats');
        this.props.setMessages(selectedUser, typeof this.messages[`${selectedUser.id}`] === 'undefined' ? [] : this.messages[`${selectedUser.id}`]);
        document.getElementById('chat-list-search-input').value = "";
        if (this.state.selectedUser.id !== selectedUser.id) this.setState({ selectedUser: selectedUser, searchBy: '' });
        this.onReadingMessages(selectedUser.id);
    }

    /**
     * Sort chat list that needs to be sent as parameter
     * @param {Array} list 
     */
    sortChatList(list) {
        list.sort((a, b) => {
            if (a.time < b.time) return 1
            else if (a.time === b.time) return 0
            else return -1
        })
        return list
    }
    /**
     * Sort contact list that needs to be sent as parameter
     * @param {Array} list 
     */
    sortContactList(list) {
        list.sort((a, b) => {
            let nameA = a.firstname + ' ' + a.surname
            let nameB = b.firstname + ' ' + b.surname
            if (nameA < nameB) return -1
            else if (nameA === nameB) return 0
            else return 1
        })
        return list
    }

    /**
     * Add chat
     * @param {*} chat 
     */
    addChat(chat) {
        let list = this.state.chatList.slice()
        list.push(chat)
        list = this.sortChatList(list)
        this.setState({ chatList: list })
    }

    /**
     * Add contact
     * @param {*} contact 
     */
    addContact(contact) {
        let list = this.state.contactList.slice()
        list.push(contact)
        list = this.sortContactList(list)
        this.setState({ contactList: list })
    }

    /**
     * Add contact
     * @param {*} contact 
     */
    removeContact(id) {
        let list = this.state.contactList.slice()

        for (let i = 0; i < list.length; i++) {
            if (list[i].id === id) {
                list.splice(i, 1);
                break;
            }

        }

        this.setState({ contactList: list })
    }

    setWriting(id, isWriting) {
        if (typeof this.chatRefs[`${id}`] === 'undefined') return;

        this.chatRefs[`${id}`].current.setWriting(isWriting);
    }

    /**
     * Returns the first message if from a certain user
     * @param {*} id user id
     */
    getLastMessageId(id) {
        if (typeof this.messages[`${id}`] === 'undefined') return;
        
        return this.messages[`${id}`][0].id;
    }

    /**
     * Checks if there is a chat with a user with the given id
     * @param {*} id user id to check
     */
    chatExists(id) {
        for (let i = 0; i < this.state.chatList.length; i++) {
            if (this.state.chatList[i].id === id) return true;
        }
        return false;
    }

    /**
     * Add messages to the end
     * @param {Number} id user id that is related to messages
     * @param {Array} messages array with messages to add to a certain user
     * @param {Boolean} sentRightNoww true if message was received by socket
     */
    addMessages(id, messages, sentRightNow) {
        if (messages.length === 0) return;

        if (typeof this.messages[`${id}`] === 'undefined') {
            this.messages[`${id}`] = [];

            //If chat contact does not exists yet
            if (!this.chatExists(id)) {
                getContactMessageInfoId(id)
                    .then(response => {
                        if (response.length > 0) {
                            this.addChat(response[0]);
                        }
                    })
                    .catch(respose => { });
            }

            if (typeof sentRightNow === 'boolean' && sentRightNow === true) {
                getMessages({ userId: id, start: -1, number: MESSAGE_NUMBER })
                    .then(response => {
                        //Store messages received on data structure
                        this.addMessages(id, response);
                    })
                    .catch(response => { });
                return;
            }
        }

        for (let i = 0; i < messages.length; i++) {
            this.messages[`${id}`].push(messages[i])
        }
    }

    /**
     * Add messages to the beginning
     * @param {Number} id user id that is related to messages
     * @param {Array} messages array with messages to add to a certain user
     */
    addMessagesToStart(id, messages) {
        if (typeof this.messages[`${id}`] === 'undefined') this.messages[`${id}`] = [];
        for (let i = messages.length - 1; i > -1; i--) {
            this.messages[`${id}`].unshift(messages[i])
        }
    }

    onReadingMessages(id) {
        if (typeof this.messages[`${id}`] === 'undefined') return;

        for (let i = this.messages[`${id}`].length - 1; i > -1; i--) {
            if (this.messages[`${id}`][i].from_id === id && (this.messages[`${id}`][i].state === 'sent' || this.messages[`${id}`][i].state === 'received')) {
                setReadMessages({ userId: id })
                    .then(response => { })
                    .catch(response => { });
                i = 0;
            }
        }
    }

    changeLastMessage(id, newMessage) {
        if (typeof this.chatRefs[`${id}`] === 'undefined') return;

        if (this.chatRefs[`${id}`].current != null)
            this.chatRefs[`${id}`].current.changeMessage(newMessage.message, newMessage.time, newMessage.from_id);

        let list = this.state.chatList.slice()

        for (let i = 0; i < list.length; i++) {
            if (list[i].id === id) {
                list[i].message = newMessage.message;
                list[i].time = newMessage.time;
                list[i].from_id = newMessage.from_id;
                list[i].state = newMessage.state;
                break;
            }
        }

        list = this.sortChatList(list);
        this.setState({ chatList: list })
    }

    modifyMessagesState(id, nextState) {
        if (typeof this.messages[`${id}`] === 'undefined') {
            this.messages[`${id}`] = [];
            return;
        }

        if (nextState === 'received') {
            for (let i = this.messages[`${id}`].length - 1; i > -1; i--) {
                if (this.messages[`${id}`][i].from_id === this.myId && this.messages[`${id}`][i].state === 'sent') {
                    this.messages[`${id}`][i].state = 'received';
                }
                else if (this.messages[`${id}`][i].from_id === this.myId && this.messages[`${id}`][i].state !== 'sent') {
                    break;
                }
            }
        }
        else if (nextState === 'read') {
            for (let i = this.messages[`${id}`].length - 1; i > -1; i--) {
                if (this.messages[`${id}`][i].from_id === this.myId && this.messages[`${id}`][i].state !== 'read') {
                    this.messages[`${id}`][i].state = 'read';
                }
                else if (this.messages[`${id}`][i].from_id === this.myId && this.messages[`${id}`][i].state === 'read') {
                    break;
                }
            }
        }

    }
}

export default ChatContactList