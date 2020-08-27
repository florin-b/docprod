import React, { Component } from 'react';
import Sidebar from '../UI/Sidebar/Sidebar';

import UserInfo from '../Data/UserInfo';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Redirect } from 'react-router';
import Button from '@material-ui/core/Button';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import MuiTableCell from '@material-ui/core/TableCell';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

import { format } from "date-fns";

import axios from 'axios';
import LoadingSpinner from '../UI/LoadingSpinner/LoadingSpinner';
import Etape from './Etape';
import Sumar from './Sumar';
import HartaNoua from './HartaNoua';
import PageHeader from '../UI/PageHeader/PageHeader';
import AppLogo from '../UI/AppLogo/AppLogo';
import HartaHelper from '../../utils/HartaHelper';
import Constants from '../Data/Constants';
import ReactDOM from 'react-dom';


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

    },
    emptyMap: {
        height: '600px'
    }
};

class Activitate extends Component {

    constructor(props) {
        super(props);

        this.state = {
            listSoferi: [{ codSofer: '-1', numeSofer: 'Selectati un sofer' }],
            loadingSoferi: false,
            listBord: [{ cod: 'Selectati un borderou', dataEmitere: '', activ: false }],
            borderouInfo: [],
            sumarInfo: '',
            hartaBord: '',
            dataStartBord: new Date(),
            dataStopBord: new Date(),
            borderouSel: 'Selectati un borderou',
            loadingBord: false,
            loadingBordData: false,
            mapCenterLat: 0,
            mapCenterLon: 0,
            traseuData: '',
            loadingMap: false
        };

        this.myRef = React.createRef();

        this.handleDateStartChange = this.handleDateStartChange.bind(this);
        this.handleDateStopChange = this.handleDateStopChange.bind(this);
        this.handleSelectedSofer = this.handleSelectedSofer.bind(this);
        this.handleSelectedBorderou = this.handleSelectedBorderou.bind(this);
        this.createBordItems = this.createBordItems.bind(this);
        this.selectSoferi = null;
        this.soferSel = '-1';


        this.getBordMap = this.getBordMap.bind(this);
    }

    componentDidMount() {
        if (UserInfo.myInstance != null) {
            this.selectSoferi = this.refs.selectSoferiRef;
            this.getSoferiService();
        }
    }



    getSoferiService() {

        this.setState(() => {
            return {
                loadingSoferi: true
            }
        });

        axios.get('/distributie/soferi', {
            params: {
                filiala: UserInfo.getInstance().getUnitLog()
            }
        })
            .then(res => {
                this.handleSoferiResponse(res);
                this.setState(() => {
                    return {
                        loadingSoferi: false
                    }
                });

            })
            .catch(error => {
                if (error.response) {
                    console.log(error.responderEnd);
                    this.setState(() => {
                        return {
                            loadingSoferi: false
                        }
                    });
                }
            });
    }


    getBorderouriService() {

        const postParams = {
            codSofer: this.soferSel,
            dataStart: format(this.state.dataStartBord, 'dd.MM.yyyy'),
            dataStop: format(this.state.dataStopBord, 'dd.MM.yyyy')
        };

        this.setState(() => {
            return {
                loadingBord: true
            }
        })

        axios.post('/distributie/borderouri', postParams)
            .then(res => {
                this.setState(() => {
                    return {
                        loadingBord: false
                    }
                })
                this.handleBordResponse(res);
            })
            .catch(error => {
                if (error.response) {
                    this.setState(() => {
                        return {
                            loadingBord: false
                        }
                    })
                    console.log(error.responderEnd);
                }
            });
    }

    handleBordResponse(response) {
        this.setState(() => {
            return {
                borderouSel: 'Selectati un borderou',
                listBord: response.data
            }
        })

    }

    handleSoferiResponse(response) {

        this.setState(() => {
            return {
                listSoferi: response.data
            }
        })
    }

    async handleDateStartChange(date1) {
        this.setState({ borderouInfo: [] });
        this.setState({ sumarInfo: '' });
        this.setState({ hartaBord: '' });
        await this.setState({ dataStartBord: date1 });
        this.getBorderouriService();
    }


    async handleDateStopChange(date1) {
        this.setState({ borderouInfo: [] });
        this.setState({ sumarInfo: '' });
        this.setState({ hartaBord: '' });
        await this.setState({ dataStopBord: date1 });
        this.getBorderouriService();
    }

    createBordItems() {

        let bordList = this.state.listBord.length > 0
            && this.state.listBord.map((item, i) => {
                return (
                    <MenuItem key={i} value={item.cod}>{item.cod}</MenuItem>
                )
            }, this);

        return bordList;
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
        this.soferSel = event.target.value;

        this.setState(() => {
            return {
                borderouInfo: [],
                sumarInfo: '',
                hartaBord: ''
            }
        })

        this.getBorderouriService();
    }

    handleSelectedBorderou(event) {

        this.setState(() => {
            return {
                borderouSel: event.target.value,
                hartaBord: ''
            }
        })

        this.getInfoBordService(event.target.value);
    }

    getInfoBordService(borderou) {

        this.setState(() => {
            return {
                loadingBordData: true
            }
        })

        axios.get('/distributie/activitateBord', {
            params: {
                borderou: borderou
            }
        })
            .then(res => {
                this.setState(() => {
                    return {
                        loadingBordData: false,
                        borderouInfo: res.data.evenimenteTraseu,
                        sumarInfo: res.data.sumarTraseu
                    }
                });

                const etapeNode = ReactDOM.findDOMNode(this.refs.etape);

                window.scrollTo({
                    top: etapeNode.offsetTop,
                    behavior: 'smooth',
                })

            })
            .catch(error => {
                if (error.response) {
                    this.setState({ loadingBordData: false });
                    console.log(error.responderEnd);
                }
            });
    }


    getBordMap() {

        this.setState({ loadingMap: true });
        axios.get('/distributie/hartaBord', {
            params: {
                borderou: this.state.borderouSel,
                dataStart: this.state.sumarInfo.dataStart,
                dataStop: this.state.sumarInfo.dataStop
            }
        })
            .then(res => {
                this.setState(() => {
                    return {
                        loadingMap: false,
                        hartaBord: res.data
                    }
                });
                this.getMapCenter(res.data);
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.responderEnd);
                }
            });

    }

    getMapCenter(tData) {

        let dateTraseu = tData.split('--');
        let istoricTraseu = dateTraseu[0];

        let center = HartaHelper.getMapCenter(istoricTraseu).split('#');

        this.setState(() => {
            return {
                traseuData: istoricTraseu,
                mapCenterLat: parseFloat(center[0]),
                mapCenterLon: parseFloat(center[1])
            }
        });

        this.el.scrollIntoView({ behavior: 'smooth' });

    }


    render() {

        const { classes } = this.props;

        let selectionZone = <Grid container spacing={4}>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <TableContainer>
                        <Table size="small">
                            <TableRow>
                                <TableCellNoLine >Sofer</TableCellNoLine>
                                <TableCellNoLine>{this.state.loadingSoferi ? <LoadingSpinner /> : <Select value={this.soferSel} onChange={this.handleSelectedSofer}>
                                    {this.createSoferiItems()}
                                </Select>}

                                </TableCellNoLine>
                            </TableRow>
                            <TableRow>
                                <TableCellNoLine>Interval</TableCellNoLine>
                                <TableCellNoLine>
                                    <div>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardDatePicker
                                                variant="standard"
                                                format="dd.MM.yyyy"
                                                margin="normal"
                                                id="date-picker-inline"
                                                value={this.state.dataStartBord}
                                                onChange={date => this.handleDateStartChange(date)}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            ></KeyboardDatePicker>
                                        </MuiPickersUtilsProvider>
                                    </div>
                                </TableCellNoLine>
                                <TableCellNoLine>
                                    <div>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardDatePicker
                                                variant="standard"
                                                format="dd.MM.yyyy"
                                                margin="normal"
                                                id="date-picker-inline"
                                                value={this.state.dataStopBord}
                                                onChange={date => this.handleDateStopChange(date)}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            ></KeyboardDatePicker>
                                        </MuiPickersUtilsProvider>
                                    </div>
                                </TableCellNoLine>

                            </TableRow>
                            <TableRow>
                                <TableCellNoLine>Borderou</TableCellNoLine>
                                <TableCellNoLine>
                                    {this.state.listBord.length === 1 ? <div>Nu exista borderouri</div> : <Select value={this.state.borderouSel} onChange={this.handleSelectedBorderou}><MenuItem value="">
                                        <em></em>
                                    </MenuItem>{this.createBordItems()}</Select>}</TableCellNoLine>
                            </TableRow>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>

            <br></br>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    {this.state.loadingBordData ? <LoadingSpinner /> : <Etape ref="etape" bordInfo={this.state.borderouInfo} />}
                </Paper>
            </Grid>

            <br></br>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <Sumar sumarInfo={this.state.sumarInfo} />
                </Paper>
            </Grid>

            <br></br>
            <Grid item xs={12}>
                {this.state.borderouInfo.length === 0 ? <div></div> : <Button variant="contained" size="small" onClick={this.getBordMap} className={classes.button}>Harta</Button>}
            </Grid>

            <br></br>
            <Grid item xs={12} >

                {this.state.loadingMap ? <LoadingSpinner /> :
                    <Paper className={classes.paper} >
                        {this.state.hartaBord === '' ? <div></div> :
                            <HartaNoua googleMapURL={Constants.GoogleMapURL}
                                loadingElement={<div style={{ height: '100%' }} />}
                                containerElement={<div style={{ height: '600px', marginBottom: '50px' }} />}
                                mapElement={<div style={{ height: '100%' }} />}
                                centerLat={this.state.mapCenterLat}
                                centerLon={this.state.mapCenterLon}
                                traseu={this.state.traseuData}
                                clienti={this.state.hartaBord}
                            />}

                    </Paper>}

            </Grid>

            <div className={classes.emptyMap}></div>

            <br></br>

            <div />
        </Grid>





        if (UserInfo.myInstance != null) {

            let pageContent = <div>
                {selectionZone}
            </div>;

            return (
                <div>
                    <Container fluid >
                        <Row>
                            <Col xs={2}><AppLogo /></Col>
                            <Col xs={9}><PageHeader headerName="Activitate soferi" /></Col>
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

export default withStyles(styles)(Activitate);