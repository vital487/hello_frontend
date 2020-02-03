import React from 'react';
import search from './img/search.png';
import { FriendLi, FriendMessage, OptionsImg, OptionsPopup, Message } from './ChatComponents';

class ChatScreen extends React.Component {
    render() {
        return (
            <div>
                <div id="nav-bar">
                    <div id="nav-bar-title">
                        <span id="nav-bar-title-text">Conversas</span>
                        <div id="nav-bar-title-container"></div>
                    </div>
                    <div id="nav-bar-chat-info">
                        Bonifácio Melancia
                </div>
                    <div id="nav-bar-menu">
                        <input id="nav-bar-menu-query" type="text" placeholder="Pesquisar" />
                        <img alt="Search" id="nav-bar-menu-img-search" src={search} />
                    </div>
                </div>
                <div id="app">
                    <div id="chat-list" className="scroll">
                        <ul>
                            <li>Manuel</li>
                            <li>João</li>
                            <li>António</li>
                        </ul>
                    </div>
                    <div id="chat">
                        <div id="chat-messages" className="scroll"></div>
                        <div id="chat-add-message"></div>
                    </div>
                    <div id="friend-list">
                        <ul>
                            <li>António</li>
                            <li>João</li>
                            <li>Manuel</li>
                        </ul>
                    </div>
                </div>

                <div id="options"></div>
            </div>
        );
    }
}

export default ChatScreen;