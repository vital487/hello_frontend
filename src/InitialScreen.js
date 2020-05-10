import React from 'react';
import { withRouter } from 'react-router-dom';
import { login, register, validateToken } from './ajax';
import { setCookie, isValidDate, getCookie, eraseCookie } from './lib';

class InitialScreen extends React.Component {
    constructor(props) {
        super(props);

        //Verify if token is validy
        let token = getCookie("token");

        if (token != null) {
            validateToken(token)
                .then(response => {
                    this.props.history.push("/chat");
                })
                .catch(response => {
                    eraseCookie("token");
                });
        }

        this.handleClickLogin = this.handleClickLogin.bind(this);
        this.handleClickRegister = this.handleClickRegister.bind(this);
        this.toLogin = this.toLogin.bind(this);
        this.toRegister = this.toRegister.bind(this);
        this.handleKeyLogin = this.handleKeyLogin.bind(this);
        this.handleKeyRegister = this.handleKeyRegister.bind(this);
    }

    render() {
        document.body.style.backgroundColor = '#eee';

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
            <div>
                <div id="iscreen-login" className="iscreen-div">
                    <h1 className="iscreen-h1">Hello!</h1>
                    <p className="iscreen-p">Email</p>
                    <input id="login-email" className="iscreen-input" type="mail" onKeyUp={(keyEvent) => this.handleKeyLogin(keyEvent)} onChange={this.handleChangeTextLogin} />
                    <p className="iscreen-p">Password</p>
                    <input id="login-password" className="iscreen-input" type="password" onKeyUp={(keyEvent) => this.handleKeyLogin(keyEvent)} onChange={this.handleChangeTextLogin} />
                    <button id="iscreen-login-button" className="iscreen-button" onClick={this.handleClickLogin}>Iniciar Sessão</button>
                    <button className="iscreen-button" onClick={this.toRegister}>Registar</button>
                    <span id="iscreen-login-error-message" className="iscreen-error-message">Password Errada</span>
                </div>

                <div id="iscreen-register" className="iscreen-div">
                    <h1 className="iscreen-h1">Hello!</h1>
                    <p className="iscreen-register-p">Nome Próprio</p>
                    <input id="iscreen-register-firstname" className="iscreen-input" type="text" onKeyUp={(keyEvent) => this.handleKeyRegister(keyEvent)} onChange={this.handleChangeTextRegister} />
                    <p className="iscreen-register-p">Apelido</p>
                    <input id="iscreen-register-surname" className="iscreen-input" type="text" onKeyUp={(keyEvent) => this.handleKeyRegister(keyEvent)} onChange={this.handleChangeTextRegister} />
                    <p className="iscreen-register-p">Email</p>
                    <input id="iscreen-register-email" className="iscreen-input" type="mail" onKeyUp={(keyEvent) => this.handleKeyRegister(keyEvent)} onChange={this.handleChangeTextRegister} />
                    <p className="iscreen-register-p">Password</p>
                    <input id="iscreen-register-password" className="iscreen-input" type="password" onKeyUp={(keyEvent) => this.handleKeyRegister(keyEvent)} onChange={this.handleChangeTextRegister} />
                    <p className="iscreen-register-p">Repetir Password</p>
                    <input id="iscreen-register-repeat-password" className="iscreen-input" type="password" onKeyUp={(keyEvent) => this.handleKeyRegister(keyEvent)} onChange={this.handleChangeTextRegister} />
                    <p className="iscreen-register-p">Género</p>
                    <div id="iscreen-register-gender">

                        <input id="iscreen-register-male" type="radio" name="gender" value="male" onKeyUp={(keyEvent) => this.handleKeyRegister(keyEvent)} onChange={this.handleChangeTextRegister} />
                        <span>Masculino</span>
                        <input id="iscreen-register-female" type="radio" name="gender" value="female" onKeyUp={(keyEvent) => this.handleKeyRegister(keyEvent)} onChange={this.handleChangeTextRegister} />
                        <span>Feminino</span>
                        
                    </div>
                    <p className="iscreen-register-p">Data de Nascimento</p>
                    <div id="iscreen-register-birth">
                        <select id="iscreen-register-day" onChange={this.handleChangeTextRegister}>
                            {days}
                        </select>
                        <select id="iscreen-register-month" onChange={this.handleChangeTextRegister}>
                            {months}
                        </select>
                        <select id="iscreen-register-year" onChange={this.handleChangeTextRegister}>
                            {years}
                        </select>
                    </div>
                    <button className="iscreen-button" onClick={this.handleClickRegister}>Registar</button>
                    <button className="iscreen-button" onClick={this.toLogin}>Iniciar Sessão</button>
                    <span id="iscreen-register-error-message" className="iscreen-error-message">Password Errada</span>
                </div>
            </div>
        );
    }

    componentDidMount() {       
        let select = document.getElementById("iscreen-register-year");
        select.selectedIndex = select.options.length - 30;

        //this.connect();
    }

    handleKeyLogin(keyEvent) {
        if (keyEvent.key === "Enter") {
            this.handleClickLogin();
        }
    }

    handleKeyRegister(keyEvent) {
        if (keyEvent.key === "Enter") {
            this.handleClickRegister();
        }
    }

    handleChangeTextLogin() {
        let error = document.getElementById("iscreen-login-error-message");

        if (error.style.visibility === "visible") {
            error.style.visibility = "hidden";
        }
    }

    handleChangeTextRegister() {
        let error = document.getElementById("iscreen-register-error-message");

        if (error.style.visibility === "visible") {
            error.style.visibility = "hidden";
        }
    }

    handleClickLogin() {
        let email = document.getElementById("login-email").value
        let password = document.getElementById("login-password").value

        this.handleChangeTextLogin();
        document.body.style.cursor = "wait";

        login({ email: email, password: password })
            .then(response => {
                setCookie("token", response.token, 1)
                document.body.style.cursor = "default";
                this.props.history.push("/chat");
            })
            .catch(response => {
                document.getElementById("root").style.cursor = "default";
                let error = document.getElementById("iscreen-login-error-message");

                error.textContent = "Email ou password errados";
                error.style.visibility = "visible";
            });
    }

    handleClickRegister() {
        let firstname = document.getElementById("iscreen-register-firstname").value;
        let surname = document.getElementById("iscreen-register-surname").value;
        let email = document.getElementById("iscreen-register-email").value;
        let password = document.getElementById("iscreen-register-password").value;
        let repeatPassword = document.getElementById("iscreen-register-repeat-password").value;
        let male = document.getElementById("iscreen-register-male");
        let female = document.getElementById("iscreen-register-female");
        let day = document.getElementById("iscreen-register-day");
        let month = document.getElementById("iscreen-register-month");
        let year = document.getElementById("iscreen-register-year");

        if (firstname.trim() === "") {
            let error = document.getElementById("iscreen-register-error-message");
            error.textContent = "Nome inválido";
            error.style.visibility = "visible";
            return;
        }

        if (surname.trim() === "") {
            let error = document.getElementById("iscreen-register-error-message");
            error.textContent = "Apelido inválido";
            error.style.visibility = "visible";
            return;
        }

        //let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!pattern.test(email)) {
            let error = document.getElementById("iscreen-register-error-message");
            error.textContent = "Email inválido";
            error.style.visibility = "visible";
            return;
        }

        if (password.trim().length < 1) {
            let error = document.getElementById("iscreen-register-error-message");
            error.textContent = "Password inválida";
            error.style.visibility = "visible";
            return;
        }

        if (password !== repeatPassword) {
            let error = document.getElementById("iscreen-register-error-message");
            error.textContent = "Passwords não coincidem";
            error.style.visibility = "visible";
            return;
        }

        if (male.checked === female.checked) {
            let error = document.getElementById("iscreen-register-error-message");
            error.textContent = "Género inválido";
            error.style.visibility = "visible";
            return;
        }

        let dayInt = parseInt(day.value);
        if (day.selectedIndex === -1 || dayInt < 1 || dayInt > 31) {
            let error = document.getElementById("iscreen-register-error-message");
            error.textContent = "Dia inválido";
            error.style.visibility = "visible";
            return;
        }

        let monthInt = parseInt(month.value);
        if (month.selectedIndex === -1 || monthInt < 1 || monthInt > 12) {
            let error = document.getElementById("iscreen-register-error-message");
            error.textContent = "Mês inválido";
            error.style.visibility = "visible";
            return;
        }

        let yearInt = parseInt(year.value);
        if (year.selectedIndex === -1 || yearInt < 1900 || yearInt > new Date().getFullYear()) {
            let error = document.getElementById("iscreen-register-error-message");
            error.textContent = "Ano inválido";
            error.style.visibility = "visible";
            return;
        }

        if (!isValidDate(yearInt, monthInt, dayInt)) {
            let error = document.getElementById("iscreen-register-error-message");
            error.textContent = "Data inválida";
            error.style.visibility = "visible";
            return;
        }

        this.handleChangeTextRegister();
        document.body.style.cursor = "wait";

        register({
            firstname: firstname.trim(),
            surname: surname.trim(),
            email: email.trim(),
            password: password,
            gender: male.checked,
            year: yearInt,
            month: monthInt,
            day: dayInt
        })
            .then(response => {
                document.body.style.cursor = "default";
                this.toLogin();
            })
            .catch(response => {
                let error = document.getElementById("iscreen-register-error-message");
                error.textContent = "Email já está a ser utilizado";
                error.style.visibility = "visible";
            });
    }

    toLogin() {
        this.handleChangeTextRegister();
        document.getElementById("iscreen-login").style.visibility = "visible";
        document.getElementById("iscreen-register").style.visibility = "hidden";
    }

    toRegister() {
        this.handleChangeTextLogin();
        document.getElementById("iscreen-login").style.visibility = "hidden";
        document.getElementById("iscreen-register").style.visibility = "visible";
    }
}

export default withRouter(InitialScreen);