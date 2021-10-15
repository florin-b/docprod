import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import { TableRow } from '@material-ui/core';
import MuiTableCell from "@material-ui/core/TableCell";
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import LoadingSpinner from '../UI/LoadingSpinner/LoadingSpinner';
import Select from '@material-ui/core/Select';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AppLogo from '../UI/AppLogo/AppLogo';
import PageHeader from '../UI/PageHeader/PageHeader';
import Sidebar from '../UI/Sidebar/Sidebar';
import UserInfo from '../Data/UserInfo';
import axios from 'axios';
import MenuItem from '@material-ui/core/MenuItem';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const styles = {
    pageContent: {
        marginTop: '20px',
        marginLeft: '50px'
    },
    button: {
        color: '#80809f',
        fontWeight: 'bold',
        background: '#F8F6FF'

    }, columnLabel: {
        width: '10%'
    },
    columnContent: {
        width: '70%'
    },
    columnContent2: {
        width: '20%'
    }, columnHeader: {
        width: '50px',
        height: '50px',
        fontSize: '15px',
        color: '#3ea2bf',
        paddingTop: '10px',
        fontFamily: 'Tahoma'
    },
    recordsCount: {
        fontFamily: 'Arial',
        color: '#848484',
    },
    tableContainer: {
        backgroundColor: '#FAFAFA'
    }
};

const TableCellNoLine = withStyles({
    root: {
        borderBottom: "none",
        color: '#80809f',
        fontWeight: 'bold',
        width: '50px'

    }
})(MuiTableCell);

class Sarja extends Component {

    constructor(props) {
        super(props);

        this.state = {
            filtruSintetic: '',
            listSintetice: [{ cod: '-1', nume: 'Selectati un sintetic' }],
            loadingSintetice: false,
            sinteticSel: '-1',
            listDocumente: [],
            documenteSel: [],
            savingStatus: false,
            savedMsg: '',
            loadingStatus: false,
            operatie: ''

        }


        this.cautaSintetic = this.cautaSintetic.bind(this);
        this.codSinteticChange = this.codSinteticChange.bind(this);
        this.handleSelectedSintetic = this.handleSelectedSintetic.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.localDocSel = [];
        this.salveazaStare = this.salveazaStare.bind(this);


    }

    codSinteticChange(event) {
        this.setState({ filtruSintetic: event.target.value });
    }

    cautaSintetic(event) {

        this.setState({ sinteticSel: '-1', loadingSintetice: true });

        axios.get('/documente/getSintetice', {
            params: {
                codSintetic: this.state.filtruSintetic
            }
        })
            .then(res => {
                this.setState({ listSintetice: res.data, loadingSintetice: false });
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.responderEnd);
                }
            });


    }

    handleSelectedSintetic(event) {

        this.setState({ sinteticSel: event.target.value, loadingStatus: true });

        axios.get('/documente/getSinteticSarja', {
            params: {
                codSintetic: event.target.value
            }
        })
            .then(res => {
                this.setState(() => {
                    return {
                        loadingStatus: false, savedMsg: ''
                    }
                });

                this.setSinteticStatus(res.data);
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.responderEnd);
                }
            });



    }

    setSinteticStatus(sintStatus) {

        if (sintStatus === true)
            this.setState({
                operatie: 'adauga'
            });
        else
            this.setState({
                operatie: 'sterge'
            });


    }

    afiseazaRepere() {

        let sinteticeList = this.state.listSintetice.length > 0
            && this.state.listSintetice.map((item, i) => {

                let strArticol = item.cod + '  -  ' + item.nume;
                if (item.cod === '-1')
                    strArticol = item.nume;

                return (
                    <MenuItem key={i} value={item.cod}>{strArticol}</MenuItem>
                )
            }, this);


        return sinteticeList;

    }

    handleRadioChange(event) {
        if (event.target.value === 'add') {
            this.setState({
                operatie: 'adauga'
            });
        }
        else {
            this.setState({
                operatie: 'sterge'
            });
        }
    }


    salveazaStare() {

        this.setState({ savingStatus: true });

        const postParams = new FormData();
        postParams.append('codSintetic', this.state.sinteticSel);
        postParams.append('tipOp', this.state.operatie);

        axios.post('/documente/setSinteticSarja', postParams)
            .then(res => {
                this.setState({ savingStatus: false });
                this.setStatusSaveTip(res.data);
            })
            .catch(error => {

                this.setState({ savingStatus: false });
                if (error.response) {
                    console.log(error.responderEnd);
                }
            });

    }

    setStatusSaveTip(response) {



        if (response)
            this.setState({ savedMsg: 'Date salvate.' })
        else
            this.setState({ savedMsg: 'Eroare salvare date.' })

    }


    render() {

        const { classes } = this.props;

        let radioGroup = <RadioGroup row aria-label="position" name="position" defaultValue="top" onChange={this.handleRadioChange}>
            <FormControlLabel
                value="add"
                control={<Radio color="primary" />}
                label="Se solicita nr. sarja"
                checked={this.state.operatie === 'adauga'}
            />
            <FormControlLabel
                value="rem"
                control={<Radio color="primary" />}
                label="Nu se solicita nr. sarja"
                checked={this.state.operatie === 'sterge'}
            />
        </RadioGroup>

        let resultZone =
            this.state.sinteticSel === '-1' ? < div></div> : <TableContainer>
                <Table size="small">
                    <tbody>
                        <TableRow>
                            <TableCellNoLine className={classes.columnHeader}>Pentru sinteticul {this.state.sinteticSel}</TableCellNoLine>
                        </TableRow>
                        <TableRow>
                            <TableCellNoLine>
                                {radioGroup}
                            </TableCellNoLine>
                        </TableRow>
                        <TableRow>
                            <TableCellNoLine><Button variant="outlined" size="small" onClick={this.salveazaStare}>Salveaza</Button>
                            </TableCellNoLine>
                            <TableCellNoLine>{this.state.savingStatus ? <LoadingSpinner /> : <div>{this.state.savedMsg}</div>}</TableCellNoLine>
                        </TableRow>
                    </tbody>
                </Table>
            </TableContainer>

        let selectionZone = <Grid container spacing={4}>
            <Grid item xs={12}>
                <Paper className={classes.paper}>

                    <TableContainer className={classes.tableContainer}>
                        <Table size="small">
                            <tbody>
                                <TableRow>
                                    <TableCellNoLine className={classes.columnLabel}>Filtru</TableCellNoLine>
                                    <TableCellNoLine >
                                        <TextField className={classes.columnContent} id="codArticol" onChange={this.codSinteticChange} value={this.state.filtruReper} />
                                    </TableCellNoLine>
                                    <TableCellNoLine className={classes.columnContent2}><Button variant="outlined" size="small" onClick={this.cautaSintetic}>Cauta</Button></TableCellNoLine>
                                </TableRow>
                                <TableRow>
                                    <TableCellNoLine className={classes.columnLabel}>Rezultat</TableCellNoLine>
                                    <TableCellNoLine >
                                        <Select className={classes.columnContent} value={this.state.sinteticSel} onChange={this.handleSelectedSintetic}>
                                            {this.afiseazaRepere()}
                                        </Select>
                                    </TableCellNoLine>
                                    <TableCellNoLine >{this.state.loadingArticole ? <LoadingSpinner /> : <div className={classes.recordsCount}>{this.state.listSintetice.length - 1} inregistrari</div>} </TableCellNoLine>
                                </TableRow>
                            </tbody>
                        </Table>
                    </TableContainer>
                </Paper>
                <br></br><br></br>

                {resultZone}
            </Grid>
        </Grid >

        return (
            <div>
                <Container fluid >
                    <Row>
                        <Col xs={2}><AppLogo /></Col>
                        <Col xs={9}><PageHeader headerName='Sintetice sarja' /></Col>
                    </Row>
                    <Row>
                        <Col xs={2}><Sidebar items={UserInfo.getInstance().getMenuItems()} /></Col>
                        <Col xs={9}><div className={classes.pageContent}>{selectionZone}</div></Col>
                    </Row>
                </Container>
            </div>
        )
    }

}

export default withStyles(styles)(Sarja);