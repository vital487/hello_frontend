import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import optionsImg from './img/options.svg';

export class Message extends React.Component {
    render() {
        return (
            <div style={{ margin: "5px" }, { display: "flex" }, { flexDirection: this.props.mine === false ? "row" : "row-reverse" }}>
                <div className="message">
                    <span>{this.props.message}</span>
                </div>
            </div>
        );
    }
}

export class FriendLi extends React.Component {
    render() {
        return (
            <div className="friendli">
                <span>{this.props.name}</span>
            </div>
        );
    }
}

export class FriendMessage extends React.Component {
    render() {
        let lastMessage = this.props.lastMessage.substring(0, 30);

        return (
            <div className="friendmessage-container">
                <span className="friendmessage-name">{this.props.name}</span>
                <span className="friendmessage-message">{lastMessage}</span>
                <time className="friendmessage-time">{this.props.lastMessageTime}</time>
            </div>
        );
    }
}

export class OptionsPopup extends React.Component {
    render() {
        return (
            <div id="optionspopup" className="optionspopup-container" style={{ top: this.props.y }, { left: this.props.x }}>
                <span className="optionspopup-li">Pedidos Pendentes</span>
                <span className="optionspopup-li" style={{ borderBottom: '' }}>Sair</span>
            </div>
        );
    }
}

export function OptionsImg() {
    function optionsImgClick() {
        let img = document.getElementById("nav-bar-title-img");
        let x = img.offsetLeft + img.clientWidth / 2;
        let y = img.offsetTop + img.clientHeight / 2;

        ReactDOM.render(
            <OptionsPopup x={x} y={y}></OptionsPopup>,
            document.getElementById("options")
        );
    }

    return (
        <img alt="" id="nav-bar-title-img" src={optionsImg} onClick={optionsImgClick} />
    );
}
/*
let mouse_is_inside = false;

$(document).ready(function () {
    $("body").mouseup(function () {
        if ($('#optionspopup:hover').length !== 0)
            mouse_is_inside = true;
        else
            mouse_is_inside = false;

        if (!mouse_is_inside)
            ReactDOM.unmountComponentAtNode(document.getElementById("options"));
    });
});

/*
ReactDOM.render(
    OptionsImg(),
    document.getElementById("nav-bar-title-container")
);

ReactDOM.render(
    <div>
        <Message mine={true} message="Boas galeras"></Message>
        <Message mine={false} message="Tudo bem?"></Message>
    </div>,
    document.getElementById("chat-messages")
);

ReactDOM.render(
    <div>
        <FriendLi name="Manuel Bonifácio Nabo"></FriendLi>
        <FriendLi name="João"></FriendLi>
    </div>,
    document.getElementById("friend-list")
);

ReactDOM.render(
    <div>
        <FriendMessage name="Manuel Bonifácio Nabo" lastMessage="Boas galeras nabo da treta" lastMessageTime="10:04"></FriendMessage>
        <FriendMessage name="João" lastMessage="Nabo da treta" lastMessageTime="23:37"></FriendMessage>
    </div>,
    document.getElementById("chat-list")
);
*/