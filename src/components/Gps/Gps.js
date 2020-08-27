import React, { Component } from 'react';

import UserInfo from '../Data/UserInfo';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Sidebar from '../UI/Sidebar/Sidebar';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import LoadingSpinner from '../UI/LoadingSpinner/LoadingSpinner';
import GpsStatus from './GpsStatus';
import PageHeader from '../UI/PageHeader/PageHeader';
import { Redirect } from 'react-router';
import AppLogo from '../UI/AppLogo/AppLogo';

const styles = {
    pageContent: {
        marginTop: '20px',
        marginLeft: '50px'
    }
};

class Gps extends Component {


    //state = {loadingData: false, gpsStatus: []}



    constructor(props) {
        super(props);
        this.state = {
            loadingData: false,
            gpsStatus: []
        }
    }

    componentDidMount() {
        if (UserInfo.myInstance != null) {

            this.setState(() => {
                return {
                    loadingData: true
                }
            });

            this.getGpsStatus();
        }
    }

    

    getGpsStatus() {
        axios.get('/distributie/gps', {
            params: {
                filiala: UserInfo.getInstance().getUnitLog()
            }
        })
            .then(res => {
                this.setState(() => {
                    return {
                        loadingData: false,
                        gpsStatus: res.data
                    }
                })
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response);
                }
            });
    }


    render() {

        const { classes } = this.props;

        let pageContent = <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    {this.state.loadingData ? <LoadingSpinner /> : <GpsStatus status={this.state.gpsStatus}></GpsStatus>}
                </Paper>
            </Grid>
        </Grid>


        if (UserInfo.myInstance != null) {

            return (
                <div>
                    <Container fluid >
                        <Row>
                            <Col xs={2}><AppLogo /></Col>
                            <Col xs={9}><PageHeader headerName='Module GPS inactive' /></Col>
                        </Row>
                        <Row>
                            <Col xs={2}><Sidebar items={UserInfo.getInstance().getMenuItems()} /></Col>
                            <Col xs={9}><div className={classes.pageContent}>{pageContent}</div></Col>
                        </Row>
                    </Container>
                </div>
            )
        }
        else {
            return (<Redirect to='/FlotaWeb' />);
        }
    }

}

export default withStyles(styles)(Gps);