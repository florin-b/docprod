import React from 'react';

import Grid from '@material-ui/core/Grid';


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


import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import Tabel from './Tabel';



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

class Raport extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            filtruFurnizor: '',
            listFurnizori: [{ codFurnizor: '-1', numeFurnizor: 'Selectati un furnizor' }],
            loadingFurnizori: false,
            furnizorSel: '-1',
            listSintetice: [],
            sintSelected: [],
            listArticole: [],
            artSelected: [],
            raportData: [],
            loadingRaport: false,
            openDialog: false
        }

        this.cautaFurnizor = this.cautaFurnizor.bind(this);
        this.numeFurnizorChange = this.numeFurnizorChange.bind(this);
        this.handleSelectedFurnizor = this.handleSelectedFurnizor.bind(this);
        this.keyDownFurnizor = this.keyDownFurnizor.bind(this);
        this.handleSinteticSel = this.handleSinteticSel.bind(this);
        this.handleArticolSel = this.handleArticolSel.bind(this);
        this.localSintSel = [];
        this.localArtSel = [];
        this.afiseazaRaport = this.afiseazaRaport.bind(this);


    }

    cautaFurnizor() {

        this.setState({ furnizorSel: '-1', loadingFurnizori: true, listArticole: [], raportData: [] });

        axios.get('/documente/cautaFurnizor', {
            params: {
                numeFurnizor: this.state.filtruFurnizor
            }
        })
            .then(res => {
                this.setState({ listFurnizori: res.data, loadingFurnizori: false });
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.responderEnd);
                }
            });

    }




    afiseazaFurnizori() {
        let furnizoriList = this.state.listFurnizori.length > 0
            && this.state.listFurnizori.map((item, i) => {

                let strFurnizor = item.codFurnizor + '  -  ' + item.numeFurnizor;
                if (item.codFurnizor === '-1')
                    strFurnizor = item.numeFurnizor;

                return (
                    <MenuItem key={i} value={item.codFurnizor}>{strFurnizor}</MenuItem>
                )
            }, this);


        return furnizoriList;
    }

    numeFurnizorChange(event) {
        this.setState({ filtruFurnizor: event.target.value });
    }

    handleSelectedFurnizor(event) {


        this.setState({ furnizorSel: event.target.value, loadingStatus: true });
        this.localSintSel = [];
        this.localArtSel = [];

        axios.get('/documente/getSinteticeFurnizor', {
            params: {
                codFurnizor: event.target.value,
                codDepart: UserInfo.getInstance().getCodDepart()
            }
        })
            .then(res => {
                this.setState(() => {
                    return {
                        loadingStatus: false,
                        listSintetice: res.data
                    }
                });

            })
            .catch(error => {
                if (error.response) {
                    console.log(error.responderEnd);
                }
            });

    }

    keyDownFurnizor(event) {
        if (event.keyCode === 13) {
            this.cautaFurnizor();
        }
    }


    createSinteticeItems() {

        const { classes } = this.props;

        let sinteticeList = this.state.listSintetice.length > 0
            && this.state.listSintetice.map((item, i) => {
                return (
                    <ListItem key={item.cod} className={classes.listItem} >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id={item.cod}
                                    value={item.cod || ''}
                                    onChange={this.handleSinteticSel}
                                    checked={item.checked || false}
                                />
                            }
                            label={item.nume + ' (' + item.cod + ')'}
                        />
                    </ListItem>
                )
            }, this);

        return sinteticeList;
    }


    handleSinteticSel(event) {

        this.localArtSel = [];

        let localList = this.state.listSintetice;

        localList.forEach(artSint => {
            if (artSint.cod === event.target.value)
                artSint.checked = event.target.checked
        });

        this.setState({ sintSelected: localList })


        if (event.target.checked) {
            this.localSintSel.push(event.target.value);
        }
        else {
            this.localSintSel.splice(this.localSintSel.indexOf(event.target.value), 1);
        }

        this.setState({ sintSelected: this.localSintSel });

        this.getArticoleFurnizor(this.localSintSel);

    }

    createArticoleItems() {

        const { classes } = this.props;

        let articoleList = this.state.listArticole.length > 0
            && this.state.listArticole.map((item, i) => {
                return (
                    <ListItem key={item.cod} className={classes.listItem} >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id={item.cod}
                                    value={item.cod || ''}
                                    onChange={this.handleArticolSel}
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

    handleArticolSel(event) {

        let localList = this.state.listArticole;

        localList.forEach(artSint => {
            if (artSint.cod === event.target.value)
                artSint.checked = event.target.checked
        });

        this.setState({ artSelected: localList })


        if (event.target.checked) {
            this.localArtSel.push(event.target.value);
        }
        else {
            this.localArtSel.splice(this.localSintSel.indexOf(event.target.value), 1);
        }

        this.setState({ artSelected: this.localArtSel });

    }

    getArticoleFurnizor(paramSintSel) {

        this.setState({ artSelected: [], listArticole: [] });

        axios.get('/documente/getArticoleFurnizor', {
            params: {
                codFurnizor: this.state.furnizorSel,
                sintetice: paramSintSel.join(",")
            }
        })
            .then(res => {
                this.setState(() => {
                    return {
                        listArticole: res.data
                    }
                });

            })
            .catch(error => {
                if (error.response) {
                    console.log(error.responderEnd);
                }
            });

    }

    afiseazaRaport() {

        this.setState(() => {
            return {
                loadingRaport: true,
                raportData: []
            }
        });

        axios.get('/documente/getDocumenteFurnizor', {
            params: {
                codFurnizor: this.state.furnizorSel,
                sintetice: this.state.sintSelected.join(","),
                articole: this.state.artSelected.join(",")
            }
        })
            .then(res => {
                this.setState(() => {
                    return {
                        loadingRaport: false,
                        raportData: res.data
                    }
                });
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.responderEnd);
                }
            });

    }

    render() {

        const { classes } = this.props;



        let sinteticeZone = <TableRow>
            <TableCellNoLine className={classes.columnLabel}>Sintetice</TableCellNoLine>
            <TableCellNoLine >
                <div style={{ maxWidth: 700, maxHeight: 150, overflow: 'auto' }}>
                    <List>
                        {this.createSinteticeItems()}
                    </List>
                </div>
            </TableCellNoLine>
        </TableRow>

        let articoleZone = <TableRow>
            <TableCellNoLine className={classes.columnLabel}>Articole</TableCellNoLine>
            <TableCellNoLine >
                <div style={{ maxWidth: 700, maxHeight: 150, overflow: 'auto' }}>
                    <List>
                        {this.createArticoleItems()}
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
                                    <TableCellNoLine className={classes.columnLabel}>Furnizor</TableCellNoLine>
                                    <TableCellNoLine >
                                        <TextField className={classes.columnContent} onKeyDown={this.keyDownFurnizor} onChange={this.numeFurnizorChange} value={this.state.filtruFurnizor} />
                                    </TableCellNoLine>
                                    <TableCellNoLine className={classes.columnContent2}><Button variant="outlined" size="small" onClick={this.cautaFurnizor}>Cauta</Button></TableCellNoLine>
                                </TableRow>
                                <TableRow>
                                    <TableCellNoLine className={classes.columnLabel}>Rezultat</TableCellNoLine>
                                    <TableCellNoLine >
                                        <Select className={classes.columnContent} value={this.state.furnizorSel} onChange={this.handleSelectedFurnizor}>
                                            {this.afiseazaFurnizori()}
                                        </Select>
                                    </TableCellNoLine>
                                    <TableCellNoLine >{this.state.loadingFurnizori ? <LoadingSpinner /> : <div className={classes.recordsCount}>{this.state.listFurnizori.length - 1} inregistrari</div>} </TableCellNoLine>
                                </TableRow>
                                {this.state.furnizorSel !== '-1' ? sinteticeZone : <div></div>}
                                <br></br>
                                {this.state.sintSelected.length > 0 ? articoleZone : <div></div>}
                                <br></br>
                            </tbody>
                        </Table>
                    </TableContainer>
                </Paper>
                {this.state.loadingFurnizori ? <LoadingSpinner /> : <div />}

            </Grid>

            <Grid item xs={12}>
                <Button variant="contained" size="small" onClick={this.afiseazaRaport} className={classes.button}>Afiseaza</Button>
                <br></br><br></br>
                {this.state.loadingRaport ? <LoadingSpinner /> : <Tabel statusInfo={this.state.raportData}></Tabel>}
                <br></br><br></br>
            </Grid>

        </Grid >

        if (UserInfo.myInstance != null) {
            return (
                <div>
                    <Container fluid >
                        <Row>
                            <Col xs={2}><AppLogo /></Col>
                            <Col xs={9}><PageHeader headerName='Raport documente' /></Col>
                        </Row>
                        <Row>
                            <Col xs={2}><Sidebar items={UserInfo.getInstance().getMenuItems()} /></Col>
                            <Col xs={9}><div className={classes.pageContent}>{selectionZone}</div></Col>
                        </Row>
                    </Container>
                </div>
            )
        } else {
            return (<Redirect to='/docuser' />);
        }


    }

}

export default withStyles(styles)(Raport);