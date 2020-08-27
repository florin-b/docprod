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

import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import MuiTableCell from "@material-ui/core/TableCell";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Status from './Status';
import PageHeader from '../UI/PageHeader/PageHeader';
import { Redirect } from 'react-router';
import UtilsFiliale from '../../utils/UtilsFiliale';
import AppLogo from '../UI/AppLogo/AppLogo';


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

class Tablete extends Component {


    constructor(props) {
        super(props);

        this.state = {
            listSoferi: [{ codSofer: '-1', numeSofer: 'Selectati un sofer' }],
            loadingSoferi: false,
            soferSel: '-1',
            textCodVisible: false,
            textSimVisible: false,
            infoTablete: [],
            loadingStatus: false,
            operatie: '',
            codTableta: '',
            codSim: '',
            filialaSel: 'NN10',
            filialaVisible: false
        }


        this.handleSelectedSofer = this.handleSelectedSofer.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.handleCodChange = this.handleCodChange.bind(this);
        this.handleSimChange = this.handleSimChange.bind(this);
        this.handleSelectedFiliala = this.handleSelectedFiliala.bind(this);

    }

    componentDidMount() {
        if (UserInfo.myInstance != null) {

            if (UserInfo.myInstance.getTipAngajat() === "SBIT")
                this.setState({ filialaVisible: true })
            else
                this.getSoferiService(UserInfo.getInstance().getUnitLog());
        }
    }

    getSoferiService(codFiliala) {

        this.setState({ loadingSoferi: true });
        axios.get('/distributie/soferi', {
            params: {
                filiala: codFiliala
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


    createFilialeItems() {

        let filialeList = Object.entries(UtilsFiliale.FILIALE)
            .map(([key, value]) => {
                return (
                    <MenuItem key={key} value={key}>{value}</MenuItem>
                )
            }, this);

        return filialeList;

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


    handleSelectedFiliala(event) {
        this.setState({
            infoTablete: [],
            filialaSel: event.target.value,
            soferSel: '-1'
        });

        this.getSoferiService(event.target.value);

    }

    handleSelectedSofer(event) {

        this.setState({
            soferSel: event.target.value,
            codTableta: '',
            codSim: '',
            textCodVisible: false,
            textSimVisible: false,
            operatie: ''

        });
        this.getInfoTableteService(event.target.value);

    }


    getInfoTableteService(codSofer) {

        this.setState({
            loadingStatus: true
        });

        axios.get('/distributie/tablete', {
            params: {
                codSofer: codSofer
            }
        })
            .then(res => {
                console.log('tablete: ' + JSON.stringify(res.data));
                this.setState({ infoTablete: res.data, loadingStatus: false });
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.responderEnd);
                }
            });
    }

    saveChanges() {

        this.setState({
            loadingStatus: true
        });

        axios.get('/distributie/gestiune', {
            params: {
                codTableta: this.state.codTableta,
                codSim: this.state.codSim,
                codSofer: this.state.soferSel,
                operatie: this.state.operatie
            }
        })
            .then(res => {
                this.setState({ loadingStatus: false });
                this.getInfoTableteService(this.state.soferSel);
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.responderEnd);
                }
            });

    }

    handleRadioChange(event) {
        if (event.target.value === 'add') {
            this.setState({
                textCodVisible: true,
                textSimVisible: true,
                operatie: 'aloca'
            });
        }
        else {
            this.setState({
                textCodVisible: false,
                textSimVisible: false,
                operatie: 'sterge'
            });
        }
    }

    handleCodChange(event) {
        this.setState({ codTableta: event.target.value });

    }

    handleSimChange(event) {
        this.setState({ codSim: event.target.value });
    }

    render() {

        const { classes } = this.props;



        let radioGroup = <RadioGroup row aria-label="position" name="position" defaultValue="top" onChange={this.handleRadioChange}>
            <FormControlLabel
                value="add"
                control={<Radio color="primary" />}
                label="Alocare tableta"
                checked={this.state.operatie === 'aloca'}
            />
            <FormControlLabel
                value="rem"
                control={<Radio color="primary" />}
                label="Inactivare tableta curenta"
                checked={this.state.operatie === 'sterge'}
            />
        </RadioGroup>

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
                                <TableCellNoLine >Sofer</TableCellNoLine>
                                <TableCellNoLine>{this.state.loadingSoferi ? <LoadingSpinner /> : <Select value={this.state.soferSel} onChange={this.handleSelectedSofer}>
                                    {this.createSoferiItems()}
                                </Select>}
                                ></TableCellNoLine>
                            </TableRow>
                            <TableRow>
                                <TableCellNoLine>Operatii</TableCellNoLine>
                                <TableCellNoLine>{radioGroup}</TableCellNoLine>
                                <TableCellNoLine> {this.state.textCodVisible ? <TextField value={this.state.codTableta} label="Cod tableta" autoFocus onChange={this.handleCodChange} /> : <div></div>}</TableCellNoLine>
                                <TableCellNoLine> {this.state.textSimVisible ? <TextField value={this.state.codSim} label="Cod sim" onChange={this.handleSimChange} /> : <div></div>}</TableCellNoLine>
                            </TableRow>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>

            <Grid item xs={12}>
                <Button variant="contained" size="small" onClick={this.saveChanges} className={classes.button}>Opereaza</Button>
                <br></br><br></br>
                {this.state.loadingStatus ? <LoadingSpinner /> : <Status statusInfo={this.state.infoTablete}></Status>}
            </Grid>

        </Grid>


        if (UserInfo.myInstance != null) {
            return (
                <div>
                    <Container fluid >
                        <Row>
                            <Col xs={2}><AppLogo /></Col>
                            <Col xs={9}><PageHeader headerName='Gestiune tablete' /></Col>
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

export default withStyles(styles)(Tablete);