import React, { Component } from 'react';

import UserInfo from '../Data/UserInfo';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Sidebar from '../UI/Sidebar/Sidebar';
import { withStyles } from '@material-ui/core/styles';
import MuiTableCell from "@material-ui/core/TableCell";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LoadingSpinner from '../UI/LoadingSpinner/LoadingSpinner';
import ListItemText from '@material-ui/core/ListItemText';
import DateFnsUtils from '@date-io/date-fns';
import { format } from "date-fns";
import Sumar from './Sumar';
import Harta from './Harta';
import HartaHelper from '../../utils/HartaHelper';
import PageHeader from '../UI/PageHeader/PageHeader';
import { Redirect } from 'react-router';
import AppLogo from '../UI/AppLogo/AppLogo';
import UtilsFiliale from '../../utils/UtilsFiliale';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';



import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';




import Constants from '../Data/Constants';

const styles = {
    pageContent: {
        marginTop: '20px',
        marginLeft: '50px'
    },
    listItem: {
        height: '22px',
        color: '#80809f',
        fontSize: '12px'
    },
    button: {
        color: '#80809f',
        fontWeight: 'bold',
        background: '#F8F6FF'

    }
};

const TableCellNoLine = withStyles({
    root: {
        borderBottom: "none",
        color: '#80809f',
        fontWeight: 'bold'

    }
})(MuiTableCell);

class Traseu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            listMasini: [],
            loadingList: false,
            selectedIndex: -1,
            startDate: new Date(),
            stopDate: new Date(),
            startTime: new Date(),
            stopTime: new Date(),
            sumarTraseu: '',
            traseuData: '',
            traseuOpriri: '',
            mapCenterLat: 0,
            mapCenterLon: 0,
            loadingMap: false,
            filialaSel: 'NN10',
            filialaVisible: false
        }

        this.handleClick = this.handleClick.bind(this);
        this.getTraseuService = this.getTraseuService.bind(this);
        this.getMapCenter = this.getMapCenter.bind(this);
        this.handleSelectedFiliala = this.handleSelectedFiliala.bind(this);

    }

    componentDidMount() {

        if (UserInfo.myInstance != null) {
            var cDate = new Date();
            this.setState({ stopTime: format(cDate, 'HH:mm') });
            cDate.setHours(0, 0, 0, 0);
            this.setState({ startTime: format(cDate, 'HH:mm') });



            if (UserInfo.myInstance.getTipAngajat() === "SBDEZ")
                this.setState({ filialaVisible: true })
            else
                this.getMasiniService(UserInfo.getInstance().getUnitLog());
        }
    }

    getMasiniService(codFiliala) {

        this.setState({ loadingList: true });
        axios.get('/distributie/masini', {
            params: {
                filiala: codFiliala
            }
        })
            .then(res => {
                this.setState({ loadingList: false });
                this.handleMasiniResponse(res);
            })
            .catch(error => {
                if (error.response) {
                    this.setState({ loadingList: false });
                }
            });

    }

    handleMasiniResponse(response) {
        this.setState({ listMasini: response.data });
    }

    handleClick(index) {
        this.setState({
            traseuData: '',
            sumarTraseu: '',
            traseuOpriri: '',
            mapCenterLat: 0,
            mapCenterLon: 0,
            selectedIndex: index
        });


    }

    createFilialeItems() {

        let filialeList = Object.entries(UtilsFiliale.FILIALE)
            .map(([key, value]) => {
                return (
                    <MenuItem key={key} value={key}>{value}</MenuItem>
                )
            }, this);

        return filialeList;

    }

    handleSelectedFiliala(event) {
        this.setState({
            filialaSel: event.target.value,
            soferSel: '-1',
            traseuData: '',
            sumarTraseu: '',
            traseuOpriri: '',
            mapCenterLat: 0,
            mapCenterLon: 0,
            selectedIndex: -1
        });

        this.getMasiniService(event.target.value);

    }

    createMasiniItems() {

        const { classes } = this.props;

        let masiniList = this.state.listMasini.length > 0
            && this.state.listMasini.map((item, i) => {
                return (
                    <ListItem key={item.deviceId} className={classes.listItem}
                        button
                        selected={this.state.selectedIndex === i}
                        onClick={(event) => this.handleClick(i)}
                    >
                        <ListItemText primary={item.nrAuto} />

                    </ListItem>
                )
            }, this);

        return masiniList;

    }

    getTraseuService() {

        if (this.state.selectedIndex === -1)
            return;

        this.setState({ loadingMap: true });

        axios.get('/distributie/traseu', {
            params: {
                masina: this.state.listMasini[this.state.selectedIndex].nrAuto,
                startI: format(this.state.startDate, 'dd.MM.yyyy') + ' ' + this.state.startTime,
                stopI: format(this.state.stopDate, 'dd.MM.yyyy') + ' ' + this.state.stopTime
            }
        })
            .then(res => {
                this.setState({ loadingMap: false });
                this.handleTraseuResponse(res.data);
            })
            .catch(error => {
                if (error.response) {

                }
            });


    }

    handleTraseuResponse(response) {
        this.setState({
            traseuData: response.traseu,
            sumarTraseu: response.sumarTraseu,
            traseuOpriri: response.opriri
        });

        this.getMapCenter(response.traseu);
    }

    getMapCenter(tData) {

        let center = HartaHelper.getMapCenter(tData).split('#');
        this.setState({
            mapCenterLat: parseFloat(center[0]),
            mapCenterLon: parseFloat(center[1])
        });

    }


    render() {

        const { classes } = this.props;

        let pageContent = <Grid container spacing={4}>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <TableContainer>
                        <Table size="small">
                            {this.state.filialaVisible ? <TableRow>
                                <TableCellNoLine >Filiala</TableCellNoLine>
                                <TableCellNoLine> <Select value={this.state.filialaSel} onChange={this.handleSelectedFiliala}>
                                    {this.createFilialeItems()}
                                </Select>
                                ></TableCellNoLine>
                            </TableRow> : <div></div>}
                            <TableRow>
                                <TableCellNoLine >Masina</TableCellNoLine>
                                <TableCellNoLine>
                                    <div style={{ maxWidth: 250, maxHeight: 130, overflow: 'auto' }}>
                                        {this.state.loadingList ? <LoadingSpinner /> : <List>{this.createMasiniItems()}</List>}
                                    </div>
                                </TableCellNoLine>
                            </TableRow>
                            <TableRow>
                                <TableCellNoLine>Inceput interval</TableCellNoLine>
                                <TableCellNoLine>
                                    <div>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardDatePicker
                                                variant="standard"
                                                format="dd.MM.yyyy"
                                                margin="normal"
                                                id="date-picker-inline"
                                                value={this.state.startDate}
                                                onChange={date => this.setState({ startDate: date })}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            ></KeyboardDatePicker>
                                        </MuiPickersUtilsProvider>
                                    </div>
                                </TableCellNoLine>
                                <TableCellNoLine>
                                    <form className={classes.container} noValidate>
                                        <TextField
                                            id="timeStart"
                                            type="time"
                                            ampm={false}
                                            ref="timeStart"
                                            value={this.state.startTime}
                                            onChange={e => this.setState({ startTime: e.target.value })}
                                            className={classes.textField}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            inputProps={{
                                                step: 300,
                                            }}
                                        />
                                    </form>
                                </TableCellNoLine>
                            </TableRow>

                            <TableRow>
                                <TableCellNoLine>Sfarsit interval</TableCellNoLine>
                                <TableCellNoLine>
                                    <div>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardDatePicker
                                                variant="standard"
                                                format="dd.MM.yyyy"
                                                margin="normal"
                                                id="date-picker-inline"
                                                value={this.state.stopDate}
                                                onChange={date => this.setState({ stopDate: date })}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            ></KeyboardDatePicker>
                                        </MuiPickersUtilsProvider>
                                    </div>
                                </TableCellNoLine>
                                <TableCellNoLine>
                                    <form className={classes.container} noValidate>
                                        <TextField
                                            id="timeStop"
                                            type="time"
                                            ampm={false}
                                            value={this.state.stopTime}
                                            onChange={e => this.setState({ stopTime: e.target.value })}
                                            className={classes.textField}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            inputProps={{
                                                step: 300,
                                            }}
                                        />
                                    </form>
                                </TableCellNoLine>

                            </TableRow>

                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" size="small" onClick={this.getTraseuService} className={classes.button}>Afiseaza</Button>
            </Grid>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    {this.state.loadingMap ? <LoadingSpinner /> : <Sumar sumarInfo={this.state.sumarTraseu}></Sumar>}
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Grid items xs={12}>
                    <Paper className={classes.paper}>
                        {this.state.traseuData.length === 0 ? <div></div> : <Harta
                            googleMapURL={Constants.GoogleMapURL}
                            loadingElement={<div style={{ height: '100%' }} />}
                            containerElement={<div style={{ height: '600px', marginBottom: '50px' }} />}
                            mapElement={<div style={{ height: '100%' }} />}
                            centerLat={this.state.mapCenterLat}
                            centerLon={this.state.mapCenterLon}
                            traseu={this.state.traseuData}
                            opriri={this.state.traseuOpriri}
                        />}
                    </Paper>
                   
                </Grid>
            </Grid>

        </Grid>

        if (UserInfo.myInstance != null) {
            return (
                <div>
                    <Container fluid >
                        <Row>
                            <Col xs={2}><AppLogo /></Col>
                            <Col xs={9}><PageHeader headerName='Traseu masina' /></Col>
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
            return (<Redirect to='/' />);
        }
    }
}


export default withStyles(styles)(Traseu);