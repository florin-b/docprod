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

import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';

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
    },
    listItem: {
        height: '22px',
        color: '#80809f',
        fontSize: '12px'
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
            loadingDocumente: false,
            tipDocAsoc: [],
            isNrSarja: false,
            articoleSintetic: [],
            artSintSelected: [],
            loadingArtSint: false

        }


        this.articolChange = this.articolChange.bind(this);
        this.codChange = this.codChange.bind(this);
        this.cautaArticol = this.cautaArticol.bind(this);
        this.codArticolChange = this.codArticolChange.bind(this);
        this.keyDownArticol = this.keyDownArticol.bind(this);
        this.afiseazaRepere = this.afiseazaRepere.bind(this);
        this.handleSelectedArticol = this.handleSelectedArticol.bind(this);
        this.handleArtSintSel = this.handleArtSintSel.bind(this);
        this.localArtSintSel = [];

    }

    articolChange(event) {
        this.localArtSintSel = [];
        this.setState({ selectieArticol: event.target.value, filtruReper: '', listArticole: [{ cod: '-1', nume: 'Selectati un articol' }], articolSel: '-1', articoleSintetic: [] });
    };

    codChange(event) {
        this.localArtSintSel = [];
        this.setState({ selectieCod: event.target.value, filtruReper: '', listArticole: [{ cod: '-1', nume: 'Selectati un articol' }], articolSel: '-1', articoleSintetic: [] });
    }

    codArticolChange(event) {
        this.localArtSintSel = [];
        this.setState({ filtruReper: event.target.value, articoleSintetic: [] });
    }

    keyDownArticol(event) {
        if (event.keyCode === 13) {
            this.cautaArticol(null);
        }
    }

    cautaArticol(event) {

        this.setState({ articolSel: '-1', loadingArticole: true, articoleSintetic: [] });

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
                    <MenuItem key={i} value={item.cod} name={i}>{strArticol}</MenuItem>
                )
            }, this);

        return articoleList;
    }


    handleSelectedArticol(event) {


        this.setTipDocAsoc(event.target.value);
        this.setState({ loadingDocumente: true });

        axios.get('/documente/getDocumente', {
            params: {
                codArticol: event.target.value,
                tipArticol: this.state.selectieArticol
            }
        })
            .then(res => {
                this.setState(() => {
                    return {
                        articolSel: event.target.value, listDocumenteArt: res.data.listDocumente, isNrSarja: res.data.nrSarja,
                        loadingDocumente: false
                    }
                });

                if (this.state.selectieArticol === 'artsint')
                    this.getArticoleSintetic(event.target.value);

            })
            .catch(error => {
                if (error.response) {
                    console.log(error.responderEnd);
                }
            });

    }


    getArticoleSintetic(codSintetic) {

        this.setState({ loadingArtSint: true });

        axios.get('/documente/getArticoleSintetic', {
            params: {
                codSintetic: codSintetic
            }
        })
            .then(res => {
                this.setState({ articoleSintetic: res.data, loadingArtSint: false });
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.responderEnd);
                }
            });

    }


    createArticoleSinteticItems() {

        const { classes } = this.props;

        let articoleList = this.state.articoleSintetic.length > 0
            && this.state.articoleSintetic.map((item, i) => {
                return (
                    <ListItem key={item.cod} className={classes.listItem} >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id={item.cod}
                                    value={item.cod || ''}
                                    onChange={this.handleArtSintSel}
                                    checked={item.checked || false}
                                />
                            }
                            label={item.nume + ' (' + item.cod + ')'}
                        />
                    </ListItem>
                )
            }, this);

        return articoleList;

    }


    handleArtSintSel(event) {

        let localList = this.state.articoleSintetic;

        localList.forEach(artSint => {
            if (artSint.cod === event.target.value)
                artSint.checked = event.target.checked
        });

        this.setState({ artSintSelected: localList })


        if (event.target.checked) {
            this.localArtSintSel.push(event.target.value);
        }
        else {
            this.localArtSintSel.splice(this.localArtSintSel.indexOf(event.target.value), 1);
        }

        this.setState({ artSintSelected: this.localArtSintSel });


    }

    setTipDocAsoc(codArticol) {

        if (codArticol === '-1')
            return;

        let localTipDoc = '';
        let localTipDocAsoc = [];

        this.state.listArticole.forEach((articol, i) => {

            if (articol.cod === codArticol) {
                localTipDoc = articol.tipDocumente;
            }


        });

        let arrayTipDoc = localTipDoc.split(',');

        Constants.tipDocumenteArticol.forEach((item, i) => {
            arrayTipDoc.forEach((tipDoc) => {

                if (tipDoc === item.cod)
                    localTipDocAsoc.push(item);

            });

        });

        this.setState({ tipDocAsoc: localTipDocAsoc });

    }

    afisDocumenteAsociate() {


        if (this.state.articolSel !== '-1') {

            let documenteList = this.state.tipDocAsoc.map((item, i) => {


                let docAlocat = false;
                let listDocumente = [];
                let mandtNrSarja = false;

                this.state.listDocumenteArt.length > 0 && this.state.listDocumenteArt.forEach((doc, j) => {

                    if (item.cod === doc.tip) {
                        docAlocat = true;
                        listDocumente = doc.listDocumente;
                    }

                });


                //sarja doar pentru Performantele determinate si verificate de producator
                if (item.cod === '6' && this.state.isNrSarja && (this.state.selectieArticol === 'articol' || this.state.selectieArticol === 'artsint')) {
                    mandtNrSarja = true;
                }




                return (
                    <DocumentAsociat key={i} tipDocument={item} articol={this.state.articolSel} docAlocat={docAlocat} listDocumente={listDocumente} isNrSarja={mandtNrSarja} listArticole={this.localArtSintSel} tipArticol={this.state.selectieArticol}></DocumentAsociat>
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
                    <tbody>
                        <TableRow>
                            <TableCellNoLine className={classes.columnHeader}>Documente asociate reperului {this.state.articolSel}</TableCellNoLine>
                        </TableRow>
                        <TableRow >
                            {this.afisDocumenteAsociate()}
                        </TableRow>
                    </tbody>
                </Table>
            </TableContainer>

        let artSintZone = <TableRow>
            <TableCellNoLine className={classes.columnLabel}>Articole</TableCellNoLine>
            <TableCellNoLine >
                <div style={{ maxWidth: 550, maxHeight: 150, overflow: 'auto' }}>
                    <List>
                        {this.createArticoleSinteticItems()}
                    </List>
                </div>
            </TableCellNoLine>
        </TableRow>

        let selectionZone = <Grid container spacing={4}>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <TableContainer className={classes.tableContainer}>
                        <Table size="small">
                            <tbody>
                                <TableRow>
                                    <TableCellNoLine className={classes.columnLabel}>Reper</TableCellNoLine>
                                    <TableCellNoLine className={classes.columnContent}>
                                        <RadioGroup row aria-label="tipSel" name="tipSel1" onChange={this.articolChange}>
                                            <FormControlLabel value="articol" control={<Radio />} label="Articol" checked={this.state.selectieArticol === 'articol'} />
                                            <FormControlLabel value="sintetic" control={<Radio />} label="Sintetic" checked={this.state.selectieArticol === 'sintetic'} />
                                            <FormControlLabel value="artsint" control={<Radio />} label="Articole sintetic" checked={this.state.selectieArticol === 'artsint'} />
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
                                        <TextField className={classes.columnContent} id="codArticol" onKeyDown={this.keyDownArticol} onChange={this.codArticolChange} value={this.state.filtruReper} />
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
                                {this.state.selectieArticol === 'artsint' && this.state.articolSel !== '-1' ? artSintZone : <TableRow></TableRow>}
                            </tbody>
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
            return (<Redirect to='/docuser' />);
        }




    }

}


export default withStyles(styles)(Document);