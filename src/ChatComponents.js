import React from 'react';
import ReactDOM from 'react-dom';
//import $ from 'jquery';
import optionsImg from './img/options.svg';

function brightnessByColor(color) {
    color = "" + color;
    let isHEX = color.indexOf("#") === 0, isRGB = color.indexOf("rgb") === 0, r, g, b;
    if (isHEX) {
        const hasFullSpec = color.length === 7;
        let m = color.substr(1).match(hasFullSpec ? /(\S{2})/g : /(\S{1})/g);
        if (m) {
            r = parseInt(m[0] + (hasFullSpec ? '' : m[0]), 16);
            g = parseInt(m[1] + (hasFullSpec ? '' : m[1]), 16);
            b = parseInt(m[2] + (hasFullSpec ? '' : m[2]), 16);
        }
    }
    if (isRGB) {
        var m = color.match(/(\d+){3}/g);
        if (m) {
            r = m[0];
            g = m[1];
            b = m[2];
        }
    }
    if (typeof r != "undefined") return ((r * 299) + (g * 587) + (b * 114)) / 1000;
}

/**
 * Torna uma cor mais clara ou mais escura
 * @param {*} hex cor em hexadecimal
 * @param {*} lum valores vão de -1 a 1. -1 é mais escuro e 1 é mais claro
 */
function setDarker(hex, lum) {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;
    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }
    return rgb;
}

export class MessageSeen extends React.Component {
    render() {
        let sentStyle = {
            borderRadius: '4em',
            backgroundColor: this.props.backgroundColor,
            width: '0%'
        };
        let text;

        const style1 = {
            display: 'flex',
            flexDirection: "row-reverse",
            marginRight: '0.5em',
            marginTop: '-0.2em'
        };

        const style2 = {
            width: '1.7em',
            height: '0.8em',
            padding: '0',
            margin: '0 0.3em 0.1em 0.3em',
            borderRadius: '4em',
            border: '#000 solid 1px',
            boxSizing: 'border-box',
            maxWidth: '40vw',
            wordWrap: 'break-word',
            fontSize: '0.8em',
            display: 'flex',
            flexDirection: 'row'
        };

        const spanStyle = {
            margin: '0 0.3em 0.6em 0em',
            fontFamily: 'sans-serif',
            fontSize: '0.7em'
        };

        switch (this.props.seen) {
            case 'read': {
                sentStyle.width = '100%';
                text = 'Lido';
                break;
            }
            case 'received': {
                sentStyle.width = '73%';
                text = 'Recebido';
                break;
            }
            case 'sent': {
                sentStyle.width = '33%';
                text = 'Enviado';
                break;
            }
            default: {
                text = 'Não Enviado';
                }
        }

        return (
            <div>
                {this.props.showText &&
                    <div style={style1}>
                    <span style={spanStyle}>{text}</span>
                </div>}
                <div style={style1}>
                    <div style={style2}>
                        <div style={sentStyle}></div>
                    </div>
                </div>
            </div>
        );
    }
}

export class Message extends React.Component {
    constructor(props) {
        super(props);

        this.handleOnClick = this.handleOnClick.bind(this);

        this.state = {
            showText: false
        };
    }

    render() {
        const style1 = {
            display: 'flex',
            flexDirection: this.props.mine === false ? "row" : "row-reverse",
            margin: '0.5em'
        };

        const style2 = {
            padding: '0.7em 1em',
            margin: '0 0.3em 0.1em 0.3em',
            borderRadius: '1em',
            border: `${setDarker(this.props.backgroundColor, -0.3)} solid 0.15em`,
            backgroundColor: this.props.backgroundColor,
            boxSizing: 'border-box',
            fontFamily: 'sans-serif',
            color: brightnessByColor(this.props.backgroundColor) < 128 ? '#fff' : '#000',
            maxWidth: '40vw',
            wordWrap: 'break-word',
            fontSize: '0.8em',
            cursor: 'pointer'
        };

        return (
            <div>
                <div style={style1}>
                    <div style={style2} onClick={this.handleOnClick}>
                        <span>{this.props.message}</span>
                    </div>
                </div>
                {this.props.mine && <MessageSeen seen={this.props.seen} backgroundColor={this.props.backgroundColor} showText={this.state.showText} />}
            </div>

        );
    }

    handleOnClick() {
        this.setState({showText: !this.state.showText}); 
    }
}

export class ContactLi extends React.Component {
    render() {
        const imgStyle = {
            height: '2em',
            padding: '0.3em'
        };

        return (
            <div className="contactli">
                <img alt="" src={this.props.img} style={imgStyle} />
                <span>{this.props.name}</span>
            </div>
        );
    }
}

export class ContactMessage extends React.Component {
    render() {
        let lastMessage = this.props.lastMessage.substring(0, 30);

        const divStyle = {
            display: 'flex',
            flexDirection: 'row',
            borderBottom: '1px solid #aaa'
        };

        const divImgStyle = {
            width: '20%',
            padding: '0.1em',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };

        const imgStyle = {
            width: '60%'
        };

        const divMsgStyle = {
            width: '80%',
            cursor: "pointer",
            wordWrap: "normal",
            padding: "0.4em",
            fontSize: "1em",
            display: "flex",
            flexDirection: "column"
        };

        const nameStyle = {
            fontWeight: 'bold'
        };

        const messageStyle = {
            fontStyle: 'italic'
        };

        const timeStyle = {

        };

        return (
            <div className="contactmessage-container" style={divStyle}>
                <div style={divImgStyle}>
                    <img alt="" src={this.props.img} style={imgStyle} />
                </div>

                <div style={divMsgStyle}>
                    <span style={nameStyle}>{this.props.name}</span>
                    <span style={messageStyle}>{lastMessage}</span>
                    <time style={timeStyle}>{this.props.lastMessageTime}</time>
                </div>
            </div>
        );
    }
}

export class OptionsPopup extends React.Component {
    render() {
        const style = {
            top: this.props.y,
            left: this.props.x
        };

        return (
            <div id="optionspopup" className="optionspopup-container" style={style}>
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