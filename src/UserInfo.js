import React from 'react';
import { isOnline } from './ajax';
import { getDataDiff } from './lib';

class UserInfo extends React.Component {
    constructor(props) {
        super(props)

        this.hide = this.hide.bind(this)
        this.onChangeUser = this.onChangeUser.bind(this)

        this.interval = null;

        this.state = {
            visible: false,
            src: '',
            name: '',
            lastSeen: 0,
            id: -1,
            online: false
        }
    }

    render() {
        const outerDivStyle = {
            display: 'flex',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            fontSize: '1vw'
        }

        const innerDivStyle = {
            display: 'flex',
            width: '100%',
            alignItems: 'center'
        }

        const imgStyle = {
            width: '2.5em',
            margin: '0.5em'
        }

        const nameStyle = {
            fontSize: '1em',
            fontWeight: '550',
            fontFamily: 'verdana'
        }

        const onlineStyle = {
            height: "0.6em",
            width: "0.6em",
            backgroundColor: this.state.online ? '#13ed1a' : '#fa3628',
            borderRadius: "50%",
            display: "inline-block",
            marginBottom: "-0.3em",
            marginLeft: "0.6em",
            visibility: "visible"
        }

        const lastSeenStyle = {
            marginLeft: '0.5em',
            fontSize: '0.7em',
            fontFamily: 'verdana'
        }

        return (
            <div style={outerDivStyle}>
                {this.state.visible &&
                    <div style={innerDivStyle}>
                        <img alt="" style={imgStyle} src={this.state.src} />
                        <span style={nameStyle}>{this.state.name}</span>
                        <span style={onlineStyle}></span>
                        {!this.state.online && this.state.lastSeen != null &&
                            <span style={lastSeenStyle}>Offline à {getDataDiff(this.state.lastSeen)}</span>}
                    </div>}
            </div>
        )
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            if (this.state.id !== -1) {
                isOnline(this.state.id)
                    .then(response => {
                        this.setState({ online: response.online, lastSeen: response.lastSeen });
                    })
                    .catch(response => {
                        this.setState({ online: false, lastSeen: null });
                    });
            }
        }, 120000);
    }

    componentWillUnmount() {
        if (this.interval != null) {
            clearInterval(this.interval);
        }
    }

    hide() {
        this.setState({ visible: false, id: -1 })
    }

    onChangeUser(src, name, online, id, lastSeen) {
        this.setState({ src, name, online, id, lastSeen, visible: true })
    }
}

export default UserInfo