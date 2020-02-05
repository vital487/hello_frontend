import React from 'react';
import search from './img/search.png';
import options from './img/options.svg';
import icon from './img/round-icon.png';
import send from './img/send.png';
import { ContactLi, Message, ContactMessage } from './ChatComponents';

class ChatScreen extends React.Component {
    constructor(props) {
        super(props);

        this.searchNew = this.searchNew.bind(this);
        this.searchContacts = this.searchContacts.bind(this);

        this.state = {
            lastChats: [],
            messageList: [],
            searchList: [],
            searching: false
        };
    }

    render() {
        document.body.style.backgroundColor = '#fff';

        return (
            <div>
                <div id="navbar">
                    <div id="navbar-title">
                        <span id="navbar-title-text">Conversas</span>
                        <img alt="" id="navbar-title-img" src={options} />
                    </div>
                    <div id="navbar-chat-info">
                        <img alt="Hello" id="navbar-chat-info-img" src={icon} />
                        <span id="navbar-chat-info-name">Hello</span>

                    </div>
                    <div id="navbar-chat-online">
                        <span id="navbar-chat-online-text">Offline</span>
                    </div>
                    <div id="navbar-chat-search">
                        <img alt="Pesquisar" id="navbar-chat-search-img" src={search} onClick={this.searchNew} />
                        <input id="navbar-chat-search-input" type="text" placeholder="Pesquisar" />
                    </div>
                </div>

                <div id="app">
                    <div id="chat-list" className="scroll">
                        <div id="chat-list-search">
                            <input id="chat-list-search-input" type="text" placeholder="Pesquisar" />
                            <img alt="Pesquisar" id="chat-list-search-img" src={search} onClick={this.searchContacts} />
                        </div>
                        <div>
                            {this.state.lastChats}
                        </div>
                    </div>
                    <div id="chat">
                        <div id="chat-messages" className="scroll">
                            {this.state.messageList}
                        </div>
                        <div id="chat-add-message">
                            <input id="chat-add-message-input" type="text" placeholder="Mensagem" />
                            <img alt="Enviar" id="chat-add-message-img" src={send} onClick={this.send} />
                        </div>
                    </div>
                    <div id="chat-search">
                        {this.state.searchList}
                    </div>
                </div>
                <div id="options"></div>
            </div>
        );
    }

    searchNew() {
        if (this.state.searching) {
            document.getElementById('chat').style.width = '80vw';
            document.getElementById('chat-search').style.width = '0vw';

            this.setState({ searching: false, searchList: [] });
        } else {
            document.getElementById('chat').style.width = '60vw';
            document.getElementById('chat-search').style.width = '20vw';

            let array = [];

            array.push(<ContactLi key={Math.random()} name="Manuel" img={icon} />);
            array.push(<ContactLi key={Math.random()} name="Maria" img={search} />);

            this.setState({ searchList: array, searching: true });
        }
    }

    searchContacts() {
        let array = this.state.messageList;

        array.push(<Message key={Math.random()} backgroundColor="#1fa3db" message="Boas galeras, tudo bem?" mine={true} seen="" />);
        array.push(<Message key={Math.random()} backgroundColor="#e0aa00" message="Sim e contigo?" mine={false} seen="sent" />);
        array.push(<Message key={Math.random()} backgroundColor="#1fa3db" message="Sim e contigo?" mine={true} seen="sent" />);
        array.push(<Message key={Math.random()} backgroundColor="#1fa3db" message="Boas galeras, tudo bem?" mine={true} seen="received" />);
        array.push(<Message key={Math.random()} backgroundColor="#1fa3db" message="Sim e contigo?" mine={true} seen="read" />);

        let lel = this.state.lastChats;

        lel.push(<ContactMessage key={Math.random()} name="Kapoer" lastMessage="234 432 eheh" lastMessageTime="12:45" img={icon} />);
        lel.push(<ContactMessage key={Math.random()} name="tyiiu" lastMessage="BARAarara" lastMessageTime="23:38" img={search} />);

        this.setState({ messageList: array, lastChats: lel });
    }
}

export default ChatScreen;