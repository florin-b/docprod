import React, { Component } from 'react';
import classes from './Login.module.css';
import Info from '../UI/Info/Info';
import LoadingSpinner from '../UI/LoadingSpinner/LoadingSpinner';
import UserInfo from '../Data/UserInfo';
import history from "../../utils/history";
import axios from 'axios';



class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: '',
            password: '',
            loading: false,
            infoVisible: false,
            infoText: ''


        }

        this.setUser = this.setUser.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }


    componentDidMount() {
        document.title = 'Management flota';
    }

    setUser(e) {
        this.setState({ user: e.target.value });

    }

    setPassword(e) {
        this.setState({ password: e.target.value });

    }

    loginService() {

        const postParams = {
            userName: this.state.user,
            password: this.state.password
        };

        axios.post('/distributie/login', postParams)
            .then(res => {
                this.setState({ loading: false });
                this.handleServiceResponse(res);
            })
            .catch(error => {
                this.setState({ loading: false });
                if (error.response) {
                    console.log(error.responderEnd);
                }
            });
    }

    loadUserInstance(response) {
        let userInstance = UserInfo.getInstance();
        userInstance.setCodPers(response.data.codPers);
        userInstance.setNume(response.data.nume);
        userInstance.setFiliala(response.data.filiala);
        userInstance.setCodDepart(response.data.codDepart);
        userInstance.setTipAngajat(response.data.tipAngajat);
        userInstance.setUnitLog(response.data.unitLog);
    }


    handleServiceResponse(response) {

        if (!response.data.successLogon) {
            this.setState({ infoText: response.data.logonMessage });
            this.setState({ infoVisible: true });
        }
        else {
            this.loadUserInstance(response);
            history.push({
                pathname: '/main',
                state: {
                    userInfo: response.data
                }
            }
            );

        }

    }


    handleSubmit(event) {
        event.preventDefault();
        this.setState({ infoVisible: false });
        this.loginService();
        this.setState({ loading: true });

    }


    render() {

        return (

            <div>
                <form onSubmit={this.handleSubmit} className={classes.LoginForm}>

                    <h3 className={classes.Title}>Management flota</h3>
                    <br></br>
                    <div >
                        <input type="text" value={this.state.user} placeholder="Utilizator" className={classes.TextInput} onChange={this.setUser} />
                    </div>

                    <div >
                        <input type="password" value={this.state.password} placeholder="Parola" className={classes.TextInput} onChange={this.setPassword} />
                    </div>



                    <button type="submit" className={classes.Button} >Login</button>

                    {this.state.loading ? <LoadingSpinner /> : <div className={classes.EmptyDiv}></div>}

                    {this.state.infoVisible && <Info infoText={this.state.infoText}></Info>}
                </form>

            </div>

        );

    };


};


export default Login;