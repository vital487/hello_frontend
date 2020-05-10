import React from 'react';
import { Message } from './ChatComponents';

class MessageScreen extends React.Component {
    constructor(props) {
        super(props)

        this.addOldMessages = this.addOldMessages.bind(this)
        this.addNewMessages = this.addNewMessages.bind(this)
        this.removeAndAddMessages = this.removeAndAddMessages.bind(this)

        this.selectedUser = {}

        this.state = {
            messages: []
        }
    }

    render() {
        //Gera as mensagens para serem apresentadas no ecrã
        let components = [];

        if (this.selectedUser.otherColor === '') this.selectedUser.otherColor = '#123456';
        if (this.selectedUser.myColor === '') this.selectedUser.myColor = '#987654';

        for (let i = 0; i < this.state.messages.length; i++) {
            components.push(<Message key={this.state.messages[i].id} backgroundColor={this.selectedUser.id === this.state.messages[i].from_id ? this.selectedUser.otherColor : this.selectedUser.myColor} message={this.state.messages[i].message} mine={this.selectedUser.id === this.state.messages[i].from_id ? false : true} seen={this.state.messages[i].state} time={this.state.messages[i].date} />);
        }

        const style = {
            paddingTop: '0.3em',
            paddingBottom: '0.3em'
        }

        return (
            <div style={style}>
                {components}
            </div>
        )
    }

    /**
     * Add messages to the beginning
     * @param {Array} messages messages to add
     */
    addOldMessages(messages) {
        let list = this.state.messages.slice()
        for (let i = messages.length - 1; i > -1; i--) {
            list.unshift(messages[i])
        }
        this.setState({ messages: list })
    }

    /**
     * Add messages to the end
     * @param {Array} messages messages to add
     */
    addNewMessages(messages) {
        let list = this.state.messages.slice()
        for (let i = 0; i < messages.length; i++) {
            list.push(messages[i])
        }
        this.setState({ messages: list })
    }

    /**
     * Removes all messages and add new ones
     * @param {Array} messages messages to add
     */
    removeAndAddMessages(messages, selectedUser) {
        let list = []
        for (let i = 0; i < messages.length; i++) {
            list.push(messages[i])
        }
        this.selectedUser = selectedUser
        this.setState({ messages: list })
    }

    modifyMessagesState(nextState) {
        let list = this.state.messages.slice();

        if (nextState === 'received') {
            for (let i = list.length - 1; i > -1; i--) {
                if (list[i].from_id !== this.selectedUser.id && list[i].state === 'sent'){
                    list[i].state = 'received';    
                }
                else if (list[i].from_id !== this.selectedUser.id && list[i].state !== 'sent') {
                    break;
                }
            }    
        }
        else if (nextState === 'read') {
            for (let i = list.length - 1; i > -1; i--) {
                if (list[i].from_id !== this.selectedUser.id && list[i].state !== 'read'){
                    list[i].state = 'read';    
                }
                else if (list[i].from_id !== this.selectedUser.id && list[i].state === 'read') {
                    break;
                }
            }    
        }
        
        this.setState({ messages: list });
    }
}

export default MessageScreen