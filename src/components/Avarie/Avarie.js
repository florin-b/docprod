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
import { Redirect } from 'react-router';

import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import MuiTableCell from "@material-ui/core/TableCell";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import TableBody from '@material-ui/core/TableBody';

import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import AppLogo from '../UI/AppLogo/AppLogo';


import Livrari from './Livrari';
import PageHeader from '../UI/PageHeader/PageHeader';

const TableCellNoLine = withStyles({
    root: {
        borderBottom: "none",
        color: '#80809f',
        fontWeight: 'bold'

    }
})(MuiTableCell);


const styles = {
    pageContent: {
        marginTop: '20px',
        marginLeft: '50px'
    },
    button: {
        color: '#80809f',
        fontWeight: 'bold',
        background: '#F8F6FF'

    }
};



class Avarie extends Component {

    constructor(props) {
        super(props);

        this.state = {
            listSoferi: [{ codSofer: '-1', numeSofer: 'Selectati un sofer' }],
            loadingSoferi: false,
            soferSel: '-1',
            livrari: [],
            smsMsg: 0,
            selectedMsg: ''

        }


        this.handleSelectedSofer = this.handleSelectedSofer.bind(this);
        this.handleSelectedMsg = this.handleSelectedMsg.bind(this);
        this.sendSms = this.sendSms.bind(this);
        this.messageList = ['Din cauza unui eveniment rutier, marfa va ajunge la dvs. cu intarziere.', 'Din cauza unui eveniment rutier, marfa nu va mai fi livrata astazi.'];
        this.telList = [];

    }

    componentDidMount() {

        if (UserInfo.myInstance != null) {
            this.setState({
                selectedMsg: this.messageList[0]
            });
            this.getSoferiService();
        }
    }

    getSoferiService() {

        this.setState({ loadingSoferi: true });
        axios.get('/distributie/soferi', {
            params: {
                filiala: UserInfo.getInstance().getUnitLog()
            }
        })
            .then(res => {
                this.handleSoferiResponse(res);
                this.setState({ loadingSoferi: false });

            })
            .catch(error => {
                if (error.response) {
                    console.log(error.responderEnd);
                    this.setState({ loadingSoferi: false });
                }
            });
    }

    handleSoferiResponse(response) {
        this.setState({ listSoferi: response.data });
    }

    createSoferiItems() {
        let soferiList = this.state.listSoferi.length > 0
            && this.state.listSoferi.map((item, i) => {
                return (
                    <MenuItem key={i} value={item.codSofer}>{item.numeSofer}</MenuItem>
                )
            }, this);

        return soferiList;
    }

    handleSelectedSofer(event) {
        this.setState({
            soferSel: event.target.value

        });
        this.getLivrariService(event.target.value);
    }

    getLivrariService(codSofer) {
        axios.get('/distributie/livrari', {
            params: {
                codSofer: codSofer
            }
        })
            .then(res => {
                this.setState({ livrari: res.data });
                this.loadTelList();
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.responderEnd);
                }
            });

    }

    loadTelList() {

        this.state.livrari.forEach((client) => {
            this.telList.push(client.telefon);
        })

    }

    createMsgItems() {
        let msgList = this.messageList.length > 0
            && this.messageList.map((item, i) => {
                return (
                    <MenuItem key={i} value={i}>{item}</MenuItem>
                )
            }, this);

        return msgList;

    }

    handleSelectedMsg(event) {
        this.setState({
            smsMsg: event.target.value,
            selectedMsg: this.messageList[event.target.value]
        });
        console.log(this.messageList[event.target.value]);
    }

    sendSms() {
        console.log(this.state.selectedMsg + ',' + this.telList);
    }

    render() {

        const { classes } = this.props;

        let smsZone = <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
                <TableHead >
                </TableHead>
                <TableBody>
                    <TableRow >
                        <TableCellNoLine>Selectati mesajul pentru expediere:</TableCellNoLine>
                    </TableRow>
                    <TableRow>
                        <TableCellNoLine><Select value={this.state.smsMsg} onChange={this.handleSelectedMsg}>{this.createMsgItems()}</Select></TableCellNoLine>
                    </TableRow>
                    <TableRow>
                        <TableCellNoLine><Button variant="contained" size="small" className={classes.button} onClick={this.sendSms}>Trimite mesajul</Button></TableCellNoLine>
                    </TableRow>
                </TableBody>
                <TableFooter></TableFooter>
            </Table>
        </TableContainer>

        let pageContent = <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <TableContainer>
                        <Table size="small">
                            <TableRow>
                                <TableCellNoLine >Sofer</TableCellNoLine>
                                <TableCellNoLine>{this.state.loadingSoferi ? <LoadingSpinner /> : <Select value={this.state.soferSel} onChange={this.handleSelectedSofer}>
                                    {this.createSoferiItems()}
                                </Select>}
                            ></TableCellNoLine>
                            </TableRow>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>

            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <Livrari livrariInfo={this.state.livrari}></Livrari>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    {this.state.livrari.length === 0 ? <div></div> : smsZone}
                </Paper>
            </Grid>
            <br></br><br></br>
        </Grid>


        if (UserInfo.myInstance != null) {
            return (
                <div>
                    <Container fluid >
                        <Row>
                            <Col xs={2}><AppLogo/></Col>
                            <Col xs={9}><PageHeader headerName='Avarie masina' /></Col>
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


export default withStyles(styles)(Avarie);