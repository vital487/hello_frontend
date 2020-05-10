import React from 'react';
import dotsImg from './img/dots.png';
import closeImg from './img/close.svg';
import { addContact, acceptRequest, declineRequest, removeContact, linkApi, getMyself, updateMyself, getContactColor, setReceiveMessages, getRelationship } from './ajax';
import { unixToDate, modifyColor, isValidDate, brightnessByColor, eraseCookie, getDataDiff, addZero } from './lib';
import { withRouter } from 'react-router-dom';

export class ContactPopup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            contact: props.relationship.contact,
            request: props.relationship.request,
            type: props.relationship.type
        };
    }

    render() {
        const gender = this.props.user.gender ? "Masculino" : "Feminino";
        const city = this.props.user.city === "" ? false : true;
        const country = this.props.user.country === "" ? false : true;
        let height, top;

        if (city && country) {
            height = '55vh';
            top = '15vh';
        } else if ((city && !country) || (!city && country)) {
            height = '50vh';
            top = '17.5vh';
        } else if (!city && !country) {
            height = '45vh';
            top = '20vh';
        }

        const divStyle = {
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '20vw',
            height: height,
            border: '1px solid #aaa',
            borderRadius: "0.5em",
            top: top,
            left: '40vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontFamily: 'sans serif',
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05) inset, 0px 0px 8px rgba(0, 0, 0, 0.6)',
            backgroundColor: '#fff'
        };

        const closeDivStyle = {
            display: 'flex',
            flexDirection: 'row-reverse',
            width: '100%'
        }

        const closeImgStyle = {
            height: '1em',
            margin: '0.3em',
            cursor: 'pointer'
        }

        const inDivStyle = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        };

        const imgStyle = {
            height: '7em',
            margin: '2em 2em 1em 2em'
        };

        const spanStyle1 = {
            fontSize: '1.6em',
            borderBottom: '1px solid #aaa'
        };

        const spanStyle2 = {
            fontSize: '1em',
            margin: '0.5em',
            fontFamily: 'helvetica'
        };

        let button;

        if (this.state.contact) {
            let buttonStyle = {
                backgroundColor: '#fc3714',
                height: '3em',
                marginTop: '0.4em'
            };

            button = <button className="iscreen-button" style={buttonStyle} onClick={() => this.handleButtonClick('removecontact')}>Remover Contacto</button>
        } else {
            if (this.state.request) {
                if (this.state.type) {
                    let buttonStyle = {
                        backgroundColor: '#f26405',
                        height: '3em',
                        marginTop: '0.4em'
                    };

                    button = <button className="iscreen-button" style={buttonStyle} onClick={() => this.handleButtonClick('declinerequest')}>Remover Pedido</button>
                } else {
                    let buttonStyle1 = {
                        backgroundColor: '#56ed42',
                        height: '3em',
                        marginTop: '0.4em',
                        width: '30%',
                        marginRight: '0.5em'
                    };

                    let buttonStyle2 = {
                        backgroundColor: '#fc3714',
                        height: '3em',
                        marginTop: '0.4em',
                        width: '30%'
                    };

                    let buttonDivStyle = {
                        display: 'flex',
                        justifyContent: 'center'
                    };

                    button = (
                        <div style={buttonDivStyle}>
                            <button className="iscreen-button" style={buttonStyle1} onClick={() => this.handleButtonClick('acceptrequest')}>Aceitar Pedido</button>
                            <button className="iscreen-button" style={buttonStyle2} onClick={() => this.handleButtonClick('declinerequest')}>Rejeitar Pedido</button>
                        </div>
                    );
                }
            } else {
                let buttonStyle = {
                    backgroundColor: '#33aef5',
                    height: '3em',
                    marginTop: '0.4em'
                };

                button = <button className="iscreen-button" style={buttonStyle} onClick={() => this.handleButtonClick('addcontact')}>Adicionar Contacto</button>
            }
        }

        return (
            <div style={divStyle}>
                <div style={closeDivStyle}>
                    <img alt="" src={closeImg} style={closeImgStyle} onClick={this.props.removePopup} />
                </div>
                <img alt="" src={linkApi + `/api/user/${this.props.user.id}/img`} style={imgStyle} />
                <span style={spanStyle1}>Nome</span>
                <span style={spanStyle2}>{this.props.user.firstname + " " + this.props.user.surname}</span>
                <span style={spanStyle1}>Género</span>
                <span style={spanStyle2}>{gender}</span>
                {city &&
                    <div style={inDivStyle}>
                        <span style={spanStyle1}>Localidade</span>
                        <span style={spanStyle2}>{this.props.user.city}</span>
                    </div>}
                {country &&
                    <div style={inDivStyle}>
                        <span style={spanStyle1}>País</span>
                        <span style={spanStyle2}>{this.props.user.country}</span>
                    </div>}
                {button}
            </div>
        );
    }

    handleButtonClick(type) {
        switch (type) {
            case 'addcontact': {
                addContact({ id: this.props.user.id })
                    .then(response => {
                        this.setState({ request: true, type: true });
                    })
                    .catch(response => {
                    });
                break;
            }
            case 'removecontact': {
                removeContact({ id: this.props.user.id })
                    .then(response => {
                        this.setState({ contact: false, request: false, type: false });
                        this.props.contactAction(this.props.user.id, 'remove');
                    })
                    .catch(response => {
                    });
                break;
            }
            case 'acceptrequest': {
                acceptRequest({ id: this.props.user.id })
                    .then(response => {
                        this.setState({ contact: true, request: false, type: false });                        
                        this.props.contactAction(this.props.user.id, 'accept');
                    })
                    .catch(response => {
                    });
                break;
            }
            case 'declinerequest': {
                declineRequest({ id: this.props.user.id })
                    .then(response => {
                        this.setState({ contact: false, request: false, type: false });
                    })
                    .catch(response => {
                    });
                break;
            }
            default: {

            }
        }
    }
}

export class MessageSeen extends React.Component {
    render() {
        let sentStyle = {
            borderRadius: '4em',
            backgroundColor: this.props.backgroundColor,
            width: '0%'
        };
        let text, msgTime;

        const outerDivStyle = {
            marginBottom: '0.5em'
        };

        const style1 = {
            display: 'flex',
            flexDirection: this.props.mine ? "row-reverse" : "row",
            marginRight: '0.5em',
            marginLeft: '1em',
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
            fontFamily: 'verdana',
            fontSize: '0.7em'
        };

        const timeStyle = {
            margin: '0 0.3em 0.6em 0em',
            fontFamily: 'verdana',
            fontSize: '0.6em',
            fontWeight: 550
        };

        switch (this.props.seen) {
            case 'read': {
                sentStyle.width = '100%';
                text = 'Lido';
                break;
            }
            case 'received': {
                sentStyle.width = '70%';
                text = 'Recebido';
                break;
            }
            case 'sent': {
                sentStyle.width = '43%';
                text = 'Enviado';
                break;
            }
            default: {
                text = 'Não Enviado';
            }
        }

        let now = unixToDate(Date.now() / 1000);
        let time = unixToDate(this.props.time);

        if (now.year === time.year) {
            msgTime = `${addZero(time.day)}/${addZero(time.month)} ${addZero(time.hour)}:${addZero(time.minutes)}`;
        } else {
            msgTime = `${addZero(time.day)}/${addZero(time.month)}/${time.year % 100} ${addZero(time.hour)}:${addZero(time.minutes)}`;
        }

        return (
            <div style={outerDivStyle}>
                {this.props.showTime &&
                    <div style={style1}>
                        <span style={timeStyle}>{msgTime}</span>
                    </div>
                }
                {this.props.showText &&
                    <div style={style1}>
                        <span style={spanStyle}>{text}</span>
                    </div>
                }
                {this.props.mine &&
                    <div style={style1}>
                        <div style={style2}>
                            <div style={sentStyle}></div>
                        </div>
                    </div>
                }
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
            marginBottom: '0.3em'
        };

        const style2 = {
            padding: '0.7em 1em',
            margin: '0 0.3em 0.1em 0.3em',
            borderRadius: '1em',
            border: `${modifyColor(this.props.backgroundColor, -0.3)} solid 0.15em`,
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
                {this.props.mine && <MessageSeen seen={this.props.seen} mine={this.props.mine} backgroundColor={this.props.backgroundColor} showTime={this.state.showText} showText={this.state.showText} time={this.props.time} />}
                {!this.props.mine && <MessageSeen seen={this.props.seen} mine={this.props.mine} backgroundColor={this.props.backgroundColor} showTime={this.state.showText} showText={false} time={this.props.time} />}
            </div>

        );
    }

    handleOnClick() {
        this.setState({ showText: !this.state.showText });
    }
}

export class UserLi extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        const divStyle = {
            borderBottom: '1px solid #aaa'
        };

        const imgStyle = {
            height: '2.3em',
            padding: '0.3em',
            marginRight: '0.4em'
        };

        return (
            <div style={divStyle} onClick={this.handleClick}>
                <div className="contactli">
                    <img alt="" src={linkApi + `/api/user/${this.props.user.id}/img`} style={imgStyle} />
                    <span>{this.props.user.firstname + " " + this.props.user.surname}</span>
                </div>
            </div>
        );
    }

    handleClick() {
        getRelationship(this.props.user.id)
            .then(response => {
                this.props.addPopup(<ContactPopup contactAction={(id, action) => this.props.contactAction(id, action)} user={this.props.user} removePopup={this.props.removePopup} relationship={response} />);
            })
            .catch(response => { });
    }
}

export class ContactLi extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);

        this.state = {
            myColor: "",
            otherColor: ""
        };

        getContactColor(props.user.id)
            .then(response => {
                this.setState({ myColor: response.me, otherColor: response.other });
            })
            .catch(response => { });
    }

    render() {
        const divStyle = {
            borderBottom: '1px solid #aaa'
        };

        const imgStyle = {
            height: '2.3em',
            padding: '0.3em',
            marginRight: '0.4em'
        };

        const spanStyle = {
            fontWeight: 'bold'
        };

        return (
            <div style={divStyle} onClick={this.handleClick}>
                <div className="contactli">
                    <img alt="" src={linkApi + `/api/user/${this.props.user.id}/img`} style={imgStyle} />
                    <span style={spanStyle}>{this.props.user.firstname + " " + this.props.user.surname}</span>
                </div>
            </div>
        );
    }

    handleClick() {
        let user = {}
        user.id = this.props.user.id;
        user.name = this.props.user.firstname + ' ' + this.props.user.surname;
        user.myColor = this.state.myColor;
        user.otherColor = this.state.otherColor;
        new Promise(() => this.props.onUserSelected(user, 'contacts'));
    }
}

export class ContactMessage extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);

        this.interval = null;

        this.state = {
            user: props.user,
            isWriting: false,
            myColor: "",
            otherColor: ""
        };

        getContactColor(props.user.id)
            .then(response => {
                this.setState({ myColor: response.me, otherColor: response.other });
            })
            .catch(response => { });
    }

    render() {
        if (!this.props.visibility) {
            return (
                <div></div>
            );
        }

        let lastMessage = this.state.user.message.substr(0, 30);
        let time = getDataDiff(this.state.user.time);

        const outerDivStyle = {
            borderBottom: "1px solid #aaa"
        };

        const imgStyle1 = {
            height: '2.3em',
            padding: '0.3em',
            marginRight: '0.4em'
        };

        const imgStyle2 = {
            height: '1.4em'
        };

        const groupDivStyle = {
            width: '90%',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '0.8em',
            padding: '0.1em',
            backgroundColor: this.state.isWriting ? '#94f7b7' : this.props.selected ? '#eee' : this.state.user.id === this.state.user.from_id && this.state.user.state !== 'read' ? '#f3c3c3' : '#fff'
        };

        const divMsgStyle = {
            width: '70%',
            cursor: "pointer",
            wordWrap: "normal",
            padding: "0.2em",
            fontSize: "0.9em",
            display: "flex",
            flexDirection: "column"
        };

        const nameStyle = {
            fontWeight: 'bold',
            color: this.state.otherColor
        };

        const timeStyle = {
            fontStyle: 'italic'
        };

        const optionsDivStyle = {
            width: '10%',
            padding: '0.1em',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            borderRadius: '0.8em'
        };

        return (
            <div style={outerDivStyle}>
                <div className="contactmessage-container">
                    <div className="contactmessage-div" style={groupDivStyle} onClick={this.handleClick}>
                        <img alt="" src={linkApi + `/api/user/${this.state.user.id}/img`} style={imgStyle1} />
                        <div style={divMsgStyle}>
                            <span style={nameStyle}>{this.state.user.name}</span>
                            <span>{lastMessage}</span>
                            <time style={timeStyle}>Enviado há {time}</time>
                        </div>
                    </div>
                    <div className="contactmessage-options" style={optionsDivStyle}>
                        <img alt="" src={dotsImg} style={imgStyle2} onClick={this.handleOptions} />
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        if (this.props.user.id === this.props.user.from_id && this.props.user.state !== "received" && this.props.user.state !== "read") {
            setReceiveMessages({ userId: this.props.user.id })
                .then(response => { })
                .catch(response => { });
        }
    }

    componentDidUpdate() {
        if (this.interval != null) {
            clearInterval(this.interval);
        }

        function now() {
            return Math.floor(Date.now() / 1000);
        }

        //SECONDS
        this.interval = setInterval(() => {
            if (now() - this.state.user.time > 59) {
                clearInterval(this.interval);

                //MINUTES
                this.interval = setInterval(() => {
                    if (now() - this.state.user.time > 3599) {
                        clearInterval(this.interval);
                        //HOURS
                        this.interval = setInterval(() => {
                            if (now() - this.state.user.time > 86399) {
                                clearInterval(this.interval);
                            }

                            this.setState({ user: this.state.user });
                        }, 3600000);
                    }
                    this.setState({ user: this.state.user });
                }, 60000);
            }
            this.setState({ user: this.state.user });
        }, 1000);
    }

    componentWillUnmount() {
        if (this.interval != null) {
            clearInterval(this.interval);
        }
    }

    handleClick() {
        let user = {}
        user.id = this.state.user.id;
        user.name = this.state.user.name;
        user.myColor = this.state.myColor;
        user.otherColor = this.state.otherColor;
        this.props.onUserSelected(user, 'chats');

        let userCopy = this.copy(this.state.user);
        userCopy.state = 'read';

        this.setState({ user: userCopy });
    }

    handleOptions() {
    }

    changeMessage(message, time, from_id) {
        let user = this.copy(this.state.user);

        user.message = message;
        user.time = time;
        user.state = 'received';
        user.from_id = from_id;

        this.setState({ user: user });
    }

    copy(mainObj) {
        let objCopy = {};
        let key;

        for (key in mainObj) {
            objCopy[key] = mainObj[key];
        }
        return objCopy;
    }

    setWriting(isWriting) {
        if (this.state.isWriting !== isWriting) {
            this.setState({ isWriting });
        }
    }
}

class OptionsPopup extends React.Component {
    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);
        this.getRequests = this.getRequests.bind(this);
        this.editUser = this.editUser.bind(this);
    }

    render() {
        const divStyle = {
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '15vw',
            height: '30vh',
            borderRadius: "1em",
            top: '30vh',
            left: '45vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontFamily: 'sans serif',
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05) inset, 0px 0px 8px rgba(0, 0, 0, 0.6)',
            fontSize: '1vw'
        };

        const closeDivStyle = {
            display: 'flex',
            flexDirection: 'row-reverse',
            width: '100%'
        }

        const closeImgStyle = {
            height: '1em',
            margin: '0.7em',
            cursor: 'pointer'
        }

        const divStyle1 = {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '70%',
            width: '100%'
        };

        const inDivStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0.3em',
            borderRadius: '0.3em',
            cursor: 'pointer'
        };

        const spanStyle = {
            fontSize: '1.3em',
            fontWeight: 540,
            color: '#0564f2',
            fontFamily: 'verdana'
        };

        return (
            <div style={divStyle}>
                <div style={closeDivStyle}>
                    <img alt="" src={closeImg} style={closeImgStyle} onClick={this.props.removePopup} />
                </div>
                <div style={divStyle1}>
                    <div style={{ borderTop: '1px solid #aaa', borderBottom: '1px solid #aaa', width: '100%' }}>
                        <div className="options-div" style={inDivStyle} onClick={this.editUser}>
                            <span style={spanStyle}>Editar Dados</span>
                        </div>
                    </div>
                    <div style={{ borderBottom: '1px solid #aaa', width: '100%' }}>
                        <div className="options-div" style={inDivStyle} onClick={this.getRequests}>
                            <span style={spanStyle}>Pedidos</span>
                        </div>
                    </div>
                    <div style={{ borderBottom: '1px solid #aaa', width: '100%' }}>
                        <div className="options-div" style={inDivStyle} onClick={this.logout}>
                            <span style={spanStyle}>Sair</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    logout() {
        eraseCookie("token");
        this.props.disconnectSocket();
        this.props.history.push("/");
    }

    getRequests() {
        this.props.getRequests();
        this.props.removePopup();
    }

    editUser() {
        getMyself()
            .then(response => {
                this.props.addPopup(<EditUserPopup user={response} removePopup={this.props.removePopup} />)
            })
            .catch(response => { });
    }


}

export class EditUserPopup extends React.Component {
    constructor(props) {
        super(props);

        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKey = this.handleKey.bind(this);

        this.state = {
            change: false,
            dayIndex: 0,
            monthIndex: 0,
            yearIndex: 0
        };
    }

    render() {
        const divStyle = {
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '40vw',
            height: '75vh',
            border: '1px solid #aaa',
            borderRadius: "0.5em",
            top: '10vh',
            left: '30vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontFamily: 'sans serif',
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05) inset, 0px 0px 8px rgba(0, 0, 0, 0.6)'
        };

        const closeDivStyle = {
            display: 'flex',
            flexDirection: 'row-reverse',
            width: '100%'
        }

        const closeImgStyle = {
            height: '1em',
            margin: '0.3em',
            cursor: 'pointer'
        }

        const imgStyle = {
            height: '7em',
            margin: '2em 2em 1em 2em'
        };

        const spanStyle1 = {
            fontSize: '1.6em',
            marginBottom: '0.7em'
        };

        const bottomDivStyle = {
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'row'
        };

        const leftDivStyle = {
            height: '100%',
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid #aaa',
            alignItems: 'center'
        };

        const rightDivStyle = {
            height: '100%',
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        };

        const buttonStyle = {
            backgroundColor: this.state.change ? '#fc3714' : '#ddd',
            height: '5em',
            marginBottom: '2em',
            width: '30%',
            cursor: this.state.change ? 'pointer' : 'default'
        };

        const selectStyle = {
            margin: '0.2em'
        };

        const gender = (
            <div style={{ marginBottom: '1.6em', fontFamily: 'verdana' }}>
                <input id="edituser-male" type="radio" name="gender" value="male" onKeyUp={this.handleKey} onChange={this.handleChange} />
                <span>Masculino</span>
                <input id="edituser-female" type="radio" name="gender" value="female" onKeyUp={this.handleKey} onChange={this.handleChange} />
                <span>Feminino</span>
            </div>
        );

        let days = [];
        let months = [];
        let years = [];

        for (let i = 1; i < 32; i++) {
            days.push(<option key={Math.random()}>{i}</option>);
        }

        for (let i = 1; i < 13; i++) {
            months.push(<option key={Math.random()}>{i}</option>);
        }

        for (let i = 1900; i < new Date().getFullYear() + 1; i++) {
            years.push(<option key={Math.random()}>{i}</option>);
        }

        return (
            <div style={divStyle}>
                <div style={closeDivStyle}>
                    <img alt="" src={closeImg} style={closeImgStyle} onClick={this.props.removePopup} />
                </div>
                <img alt="" src={linkApi + `/api/user/${this.props.user.id}/img`} style={imgStyle} />
                <div style={bottomDivStyle}>
                    <div style={leftDivStyle}>
                        <span style={spanStyle1}>Nome</span>
                        <input id="edituser-firstname" className="edituser-input" type="text" onKeyUp={this.handleKey} onChange={this.handleChange} />
                        <span style={spanStyle1}>Apelido</span>
                        <input id="edituser-surname" className="edituser-input" type="text" onKeyUp={this.handleKey} onChange={this.handleChange} />
                        <span style={spanStyle1}>Género</span>
                        {gender}
                        <span style={spanStyle1}>Foto</span>
                        <input id="edituser-file" type="file" name="file" accept="image/*" onChange={this.handleChange} disabled />
                    </div>
                    <div style={rightDivStyle}>
                        <span style={spanStyle1}>Email</span>
                        <input id="edituser-email" className="edituser-input" type="mail" onKeyUp={this.handleKey} onChange={this.handleChange} />
                        <span style={spanStyle1}>Cidade</span>
                        <input id="edituser-city" className="edituser-input" type="text" onKeyUp={this.handleKey} onChange={this.handleChange} />
                        <span style={spanStyle1}>País</span>
                        <input id="edituser-country" className="edituser-input" type="text" onKeyUp={this.handleKey} onChange={this.handleChange} />
                        <span style={spanStyle1}>Data de Nascimento</span>
                        <div id="edituser-birth">
                            <select id="edituser-day" style={selectStyle} onKeyUp={this.handleKey} onChange={this.handleChange}>
                                {days}
                            </select>
                            <select id="edituser-month" style={selectStyle} onKeyUp={this.handleKey} onChange={this.handleChange}>
                                {months}
                            </select>
                            <select id="edituser-year" style={selectStyle} onKeyUp={this.handleKey} onChange={this.handleChange}>
                                {years}
                            </select>
                        </div>
                    </div>
                </div>
                <span id="edituser-error-message" className="iscreen-error-message">Password Errada</span>
                <button className="iscreen-button" style={buttonStyle} onClick={this.handleButtonClick}>Alterar Dados</button>
            </div>
        );
    }

    componentDidMount() {
        document.getElementById('edituser-firstname').value = this.props.user.firstname;
        document.getElementById('edituser-surname').value = this.props.user.surname;
        document.getElementById('edituser-email').value = this.props.user.email;
        document.getElementById('edituser-city').value = this.props.user.city;
        document.getElementById('edituser-country').value = this.props.user.country;

        let date = unixToDate(this.props.user.birth);
        document.getElementById('edituser-day').value = date.day;
        document.getElementById('edituser-month').value = date.month;
        document.getElementById('edituser-year').value = date.year;

        if (this.props.user.gender) {
            document.getElementById('edituser-male').checked = true;
        } else {
            document.getElementById('edituser-female').checked = true;
        }
    }

    componentDidUpdate() {
        document.getElementById('edituser-day').selectedIndex = this.state.dayIndex;
        document.getElementById('edituser-month').selectedIndex = this.state.monthIndex;
        document.getElementById('edituser-year').selectedIndex = this.state.yearIndex;
    }

    handleKey(keyEvent) {
        if (keyEvent.key === "Enter") {
            this.handleButtonClick();
        }
    }

    handleButtonClick() {
        if (this.state.change) {
            let firstname = document.getElementById("edituser-firstname").value;
            let surname = document.getElementById("edituser-surname").value;
            let email = document.getElementById("edituser-email").value;
            let city = document.getElementById("edituser-city").value;
            let country = document.getElementById("edituser-country").value;
            let male = document.getElementById("edituser-male");
            let female = document.getElementById("edituser-female");
            let day = document.getElementById("edituser-day");
            let month = document.getElementById("edituser-month");
            let year = document.getElementById("edituser-year");

            if (firstname.trim() === "") {
                let error = document.getElementById("edituser-error-message");
                error.textContent = "Nome inválido";
                error.style.visibility = "visible";
                return;
            }

            if (surname.trim() === "") {
                let error = document.getElementById("edituser-error-message");
                error.textContent = "Apelido inválido";
                error.style.visibility = "visible";
                return;
            }

            //let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            let pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (!pattern.test(email)) {
                let error = document.getElementById("edituser-error-message");
                error.textContent = "Email inválido";
                error.style.visibility = "visible";
                return;
            }

            if (male.checked === female.checked) {
                let error = document.getElementById("edituser-error-message");
                error.textContent = "Género inválido";
                error.style.visibility = "visible";
                return;
            }

            let dayInt = parseInt(day.value);
            if (day.selectedIndex === -1 || dayInt < 1 || dayInt > 31) {
                let error = document.getElementById("edituser-error-message");
                error.textContent = "Dia inválido";
                error.style.visibility = "visible";
                return;
            }

            let monthInt = parseInt(month.value);
            if (month.selectedIndex === -1 || monthInt < 1 || monthInt > 12) {
                let error = document.getElementById("edituser-error-message");
                error.textContent = "Mês inválido";
                error.style.visibility = "visible";
                return;
            }

            let yearInt = parseInt(year.value);
            if (year.selectedIndex === -1 || yearInt < 1900 || yearInt > new Date().getFullYear()) {
                let error = document.getElementById("edituser-error-message");
                error.textContent = "Ano inválido";
                error.style.visibility = "visible";
                return;
            }

            if (!isValidDate(yearInt, monthInt, dayInt)) {
                let error = document.getElementById("edituser-error-message");
                error.textContent = "Data inválida";
                error.style.visibility = "visible";
                return;
            }

            let img = document.getElementById('edituser-file').files[0];

            updateMyself({
                firstname: firstname.trim(),
                surname: surname.trim(),
                email: email.trim(),
                city: city.trim(),
                country: country.trim(),
                gender: male.checked,
                year: yearInt,
                month: monthInt,
                day: dayInt
            },
                img
            )
                .then(response => {
                    let dayIndex = document.getElementById('edituser-day').selectedIndex;
                    let monthIndex = document.getElementById('edituser-month').selectedIndex;
                    let yearIndex = document.getElementById('edituser-year').selectedIndex;

                    this.setState({ dayIndex: dayIndex, monthIndex: monthIndex, yearIndex: yearIndex, change: false });
                })
                .catch(response => { });


        }
    }

    handleChange() {
        let error = document.getElementById("edituser-error-message");

        if (error.style.visibility === "visible") {
            error.style.visibility = "hidden";
        }

        let day = document.getElementById('edituser-day').selectedIndex;
        let month = document.getElementById('edituser-month').selectedIndex;
        let year = document.getElementById('edituser-year').selectedIndex;

        if (!this.state.change) {
            this.setState({ dayIndex: day, monthIndex: month, yearIndex: year, change: true });
        }
    }
}

export default withRouter(OptionsPopup);