import React from 'react';
import Constants from '../Data/Constants';
import Grid from '@material-ui/core/Grid';

import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import UserInfo from '../Data/UserInfo';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AppLogo from '../UI/AppLogo/AppLogo';
import PageHeader from '../UI/PageHeader/PageHeader';
import { Redirect } from 'react-router';
import Sidebar from '../UI/Sidebar/Sidebar';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import MuiTableCell from "@material-ui/core/TableCell";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import LoadingSpinner from '../UI/LoadingSpinner/LoadingSpinner';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { TableRow } from '@material-ui/core';
import DocumentAsociat from './DocumentAsociat';
import { format } from "date-fns";

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

class Document extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            selectieArticol: 'articol',
            selectieCod: 'cod',
            filtruReper: '',
            listArticole: [{ cod: '-1', nume: 'Selectati un articol' }],
            articolSel: '-1',
            loadingArticole: false,
            listDocumenteArt: [],
            loadingDocumente: false

        }


        this.articolChange = this.articolChange.bind(this);
        this.codChange = this.codChange.bind(this);
        this.cautaArticol = this.cautaArticol.bind(this);
        this.codArticolChange = this.codArticolChange.bind(this);
        this.afiseazaRepere = this.afiseazaRepere.bind(this);
        this.handleSelectedArticol = this.handleSelectedArticol.bind(this);




    }

    articolChange(event) {
        this.setState({ selectieArticol: event.target.value, filtruReper: '' });
    };

    codChange(event) {
        this.setState({ selectieCod: event.target.value, filtruReper: '' });
    }

    codArticolChange(event) {
        this.setState({ filtruReper: event.target.value });
    }

    cautaArticol(event) {

        this.setState({ articolSel: '-1', loadingArticole: true });

        axios.get('/documente/cautaArticol', {
            params: {
                tipArticol: this.state.selectieArticol,
                codArticol: this.state.selectieCod,
                textArticol: this.state.filtruReper
            }
        })
            .then(res => {
                this.setState({ listArticole: res.data, loadingArticole: false });
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.responderEnd);
                }
            });




    }



    afiseazaRepere() {

        let articoleList = this.state.listArticole.length > 0
            && this.state.listArticole.map((item, i) => {

                let strArticol = item.cod + '  -  ' + item.nume;
                if (item.cod === '-1')
                    strArticol = item.nume;

                return (
                    <MenuItem key={i} value={item.cod}>{strArticol}</MenuItem>
                )
            }, this);


        return articoleList;

    }


    handleSelectedArticol(event) {

        this.setState({ loadingDocumente: true });

        axios.get('/documente/getDocumente', {
            params: {
                codArticol: event.target.value
            }
        })
            .then(res => {
                this.setState(() => {
                    return {
                        articolSel: event.target.value, listDocumenteArt: res.data,
                        loadingDocumente: false
                    }
                });


            })
            .catch(error => {
                if (error.response) {
                    console.log(error.responderEnd);
                }
            });


    }


    afisDocumenteAsociate() {



        if (this.state.articolSel !== '-1') {

            let documenteList = Constants.tipDocumenteArticol.map((item, i) => {

                let docStartValid = format(new Date(), 'dd.MM.yyyy');
                let docStopValid = format(new Date(), 'dd.MM.yyyy');
                let docAlocat = false;

                this.state.listDocumenteArt.length > 0 && this.state.listDocumenteArt.map((doc, j) => {

                    if (i === j) {
                        docStartValid = doc.dataStartVal;
                        docStopValid = doc.dataStopVal;
                        docAlocat = true;
                    }

                });

                return (
                    <DocumentAsociat tipDocument={item} articol={this.state.articolSel} docStartValid={docStartValid} docStopValid={docStopValid} docAlocat={docAlocat} ></DocumentAsociat>
                )
            });

            return documenteList;
        }
    }

    render() {

        const { classes } = this.props;

        let resultZone =
            this.state.articolSel === '-1' ? < div></div> : <TableContainer>
                <Table size="small">
                    <TableRow>
                        <TableCellNoLine className={classes.columnHeader}>Documente asociate reperului {this.state.articolSel}</TableCellNoLine>
                    </TableRow>
                    <TableRow >
                        {this.afisDocumenteAsociate()}
                    </TableRow>
                </Table>
            </TableContainer>


        let selectionZone = <Grid container spacing={4}>
            <Grid item xs={12}>
                <Paper className={classes.paper}>

                    <TableContainer className={classes.tableContainer}>
                        <Table size="small">
                            <TableRow>
                                <TableCellNoLine className={classes.columnLabel}>Reper</TableCellNoLine>
                                <TableCellNoLine className={classes.columnContent}>
                                    <RadioGroup row aria-label="tipSel" name="tipSel1" onChange={this.articolChange}>
                                        <FormControlLabel value="articol" control={<Radio />} label="Articol" checked={this.state.selectieArticol === 'articol'} />
                                        <FormControlLabel value="sintetic" control={<Radio />} label="Sintetic" checked={this.state.selectieArticol === 'sintetic'} />
                                    </RadioGroup>
                                </TableCellNoLine>
                            </TableRow>

                            <TableRow>
                                <TableCellNoLine className={classes.columnLabel}>Criteriu</TableCellNoLine>
                                <TableCellNoLine className={classes.columnContent}>
                                    <RadioGroup row aria-label="tipSel" name="tipSel1" onChange={this.codChange}>
                                        <FormControlLabel value="cod" control={<Radio />} label="Cod" checked={this.state.selectieCod === 'cod'} />
                                        <FormControlLabel value="nume" control={<Radio />} label="Nume" checked={this.state.selectieCod === 'nume'} />
                                    </RadioGroup>
                                </TableCellNoLine>
                            </TableRow>

                            <TableRow>
                                <TableCellNoLine className={classes.columnLabel}>Filtru</TableCellNoLine>
                                <TableCellNoLine >
                                    <TextField className={classes.columnContent} id="codArticol" onChange={this.codArticolChange} value={this.state.filtruReper} />
                                </TableCellNoLine>
                                <TableCellNoLine className={classes.columnContent2}><Button variant="outlined" size="small" onClick={this.cautaArticol}>Cauta</Button></TableCellNoLine>
                            </TableRow>
                            <TableRow>
                                <TableCellNoLine className={classes.columnLabel}>Rezultat</TableCellNoLine>
                                <TableCellNoLine >
                                    <Select className={classes.columnContent} value={this.state.articolSel} onChange={this.handleSelectedArticol}>
                                        {this.afiseazaRepere()}
                                    </Select>
                                </TableCellNoLine>
                                <TableCellNoLine >{this.state.loadingArticole ? <LoadingSpinner /> : <div className={classes.recordsCount}>{this.state.listArticole.length - 1} inregistrari</div>} </TableCellNoLine>
                            </TableRow>
                        </Table>
                    </TableContainer>
                </Paper>
                <br></br><br></br>
                {this.state.loadingDocumente ? <LoadingSpinner /> : <div />}

                {resultZone}

            </Grid>


        </Grid >



        if (UserInfo.myInstance != null) {

            return (
                <div>
                    <Container fluid >
                        <Row>
                            <Col xs={2}><AppLogo /></Col>
                            <Col xs={9}><PageHeader headerName='Gestiune documente' /></Col>
                        </Row>
                        <Row>
                            <Col xs={2}><Sidebar items={UserInfo.getInstance().getMenuItems()} /></Col>
                            <Col xs={9}><div className={classes.pageContent}>{selectionZone}</div></Col>
                        </Row>
                    </Container>
                </div>
            )


        }
        else {
            return (<Redirect to='/documente' />);
        }




    }

}


export default withStyles(styles)(Document);