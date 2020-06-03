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
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import LoadingSpinner from '../UI/LoadingSpinner/LoadingSpinner';
import Harta from './Harta';
import Constants from '../Data/Constants';
import HartaHelper from '../../utils/HartaHelper';
import PageHeader from '../UI/PageHeader/PageHeader';
import { Redirect } from 'react-router';
import AppLogo from '../UI/AppLogo/AppLogo';

import greenTruck from '../../images/green_truck.png';
import redTruck from '../../images/red_truck.png';
import blueTruck from '../../images/blue_truck.png';

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

    },
    infoText: {
        color: '#80809f',
        fontSize: '15px',
        marginRight: '40px'
    }
};

const TableCellNoLine = withStyles({
    root: {
        borderBottom: "none",
        color: '#80809f',
        fontWeight: 'bold'

    }
})(MuiTableCell);


class Localizare extends Component {


    constructor(props) {
        super(props);

        this.state = {
            listMasini: [],
            masiniSel: [],
            loadingList: false,
            masiniData: '',
            mapCenterLat: 0,
            mapCenterLon: 0,
            loadingMap: false


        }

        this.handleMasinaSel = this.handleMasinaSel.bind(this);
        this.handleSelectToate = this.handleSelectToate.bind(this);
        this.getMasiniMap = this.getMasiniMap.bind(this);
        this.getMapCenter = this.getMapCenter.bind(this);
        this.localMasiniSel = [];



    }

    componentDidMount() {
        if (UserInfo.myInstance != null) {
            this.setState({ loadingList: true });
            this.getMasiniService();
        }
    }

    getMasiniService() {
        axios.get('/distributie/masini', {
            params: {
                filiala: UserInfo.getInstance().getUnitLog()
            }
        })
            .then(res => {
                this.setState({ loadingList: false });
                this.handleMasiniResponse(res);
            })
            .catch(error => {
                if (error.response) {
                    this.setState({ loadingList: false });
                    console.log(error.responderEnd);

                }
            });

    }


    handleMasiniResponse(response) {
        this.setState({ listMasini: response.data });

    }

    handleMasinaSel(event) {

        let localList = this.state.listMasini;

        localList.forEach(masina => {
            if (masina.nrAuto === event.target.value)
                masina.checked = event.target.checked
        });

        this.setState({ masiniSel: localList })


        if (event.target.checked) {
            this.localMasiniSel.push(event.target.value);
        }
        else {
            this.localMasiniSel.splice(this.localMasiniSel.indexOf(event.target.value), 1);
        }

        this.setState({ masiniSel: this.localMasiniSel });

    }

    handleSelectToate(event) {

        this.localMasiniSel = [];

        let localList = this.state.listMasini;

        localList.forEach(masina => masina.checked = event.target.checked);

        localList.forEach(masina => {
            if (masina.checked)
                this.localMasiniSel.push(masina.nrAuto);
            else
                this.localMasiniSel.splice(this.localMasiniSel.indexOf(masina.nrAuto), 1);
        });


        this.setState({ listMasini: localList, masiniSel: this.localMasiniSel });

    }

    getMasiniMap() {

        this.setState({ loadingMap: true });
        this.getLocatieService();
    }

    getLocatieService() {

        axios.get('/distributie/localizare', {
            params: {
                masini: this.state.masiniSel.toString()
            }
        })
            .then(res => {
                this.setState({
                    loadingMap: false,
                    masiniData: res.data
                });
                this.getMapCenter();
            })
            .catch(error => {
                if (error.response) {

                }
            });

    }

    createMasiniItems() {

        const { classes } = this.props;

        let masiniList = this.state.listMasini.length > 0
            && this.state.listMasini.map((item, i) => {
                return (
                    <ListItem key={item.deviceId} className={classes.listItem} >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id={item.nrAuto}
                                    value={item.nrAuto}
                                    onChange={this.handleMasinaSel}
                                    checked={item.checked}
                                />
                            }
                            label={item.nrAuto}
                        />
                    </ListItem>
                )
            }, this);

        return masiniList;

    }

    getMapCenter() {
        let center = HartaHelper.getMapCenter(this.state.masiniData).split('#');
        this.setState({ mapCenterLat: parseFloat(center[0]) });
        this.setState({ mapCenterLon: parseFloat(center[1]) });
    }


    render() {
        const { classes } = this.props;

        let pageContent = <Grid container spacing={4}>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <TableContainer>
                        <Table size="small">
                            <TableRow>
                                <TableCellNoLine >Masina</TableCellNoLine>
                                <TableCellNoLine>
                                    <div style={{ maxWidth: 250, maxHeight: 130, overflow: 'auto' }}>
                                        {this.state.loadingList ? <LoadingSpinner /> : <List>{this.createMasiniItems()}</List>}
                                    </div>
                                </TableCellNoLine>
                                <TableCellNoLine>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                id="100"
                                                value="100"
                                                onChange={this.handleSelectToate}
                                            />
                                        }
                                        label="Toate masinile"
                                    />
                                </TableCellNoLine>
                            </TableRow>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" size="small" onClick={this.getMasiniMap} className={classes.button}>Harta</Button>
            </Grid>
            <Grid item xs={12}>
                {this.state.loadingMap ? <LoadingSpinner /> : <Paper className={classes.paper}>
                    {this.state.masiniData.length === 0 ? <div></div> : <Harta
                        googleMapURL={Constants.GoogleMapURL}
                        loadingElement={<div style={{ height: '100%' }} />}
                        containerElement={<div style={{ height: '600px', marginBottom: '50px' }} />}
                        mapElement={<div style={{ height: '100%' }} />}
                        centerLat={this.state.mapCenterLat}
                        centerLon={this.state.mapCenterLon}
                        masiniData={this.state.masiniData}
                    />}
                </Paper>}
                {this.state.loadingMap || this.state.masiniData.length === 0 ? <div></div> : <div >
                    <span className={classes.infoText}><img src={redTruck} alt="Borderou activ" /> Borderou activ    </span>
                    <span className={classes.infoText}><img src={greenTruck} alt="Borderou terminat" /> Borderou terminat    </span>
                    <span className={classes.infoText}><img src={blueTruck} alt="Fara borderou"/> Fara borderou    </span>
                </div>}
                <br></br><br></br><br></br>
            </Grid>


        </Grid>



        if (UserInfo.myInstance != null) {
            return (
                <div>
                    <Container fluid >
                        <Row>
                            <Col xs={2}><AppLogo /></Col>
                            <Col xs={9}><PageHeader headerName='Localizare masini' /></Col>
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

export default withStyles(styles)(Localizare);