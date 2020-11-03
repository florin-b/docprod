import React, { Component } from 'react';
import UserInfo from '../Data/UserInfo';
import { Redirect } from 'react-router';

class Iesire extends Component {

    componentDidMount() {
        UserInfo.myInstance = null;
    }

    render() {
        return (<Redirect to='/documentatie' />);
    }

}

export default Iesire;