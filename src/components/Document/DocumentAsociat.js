import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import { TableRow } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import MuiTableCell from "@material-ui/core/TableCell";
import Button from '@material-ui/core/Button';
import axios from 'axios';
import DateFnsUtils from '@date-io/date-fns';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

import { format } from "date-fns";
import LoadingSpinner from '../UI/LoadingSpinner/LoadingSpinner';
import redBox from '../../images/Box_red.png';
import greenBox from '../../images/Box_green.png';
import yellowBox from '../../images/Box_yellow.png';
import DocumentFurnizor from './DocumentFurnizor';
import TextField from '@material-ui/core/TextField';
import UserInfo from '../Data/UserInfo';
import UtilsFiliale from '../../utils/UtilsFiliale';
import Constants from '../Data/Constants';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

const styles = {
    card: {
        marginTop: '10px',
        marginBottom: '5px',
        backgroundColor: '#FAFAFA'
    },
    title: {
        marginBottom: 16,
        fontSize: 15,
        fontWeight: 'bold',
        color: '#654fa7'
    },
    pos: {
        fontSize: 14,
        marginTop: 10,
    },
    columnLabel: {
        marginLeft: '0px',
        fontWeight: 'normal',
        width: '10%'
    }, columnLabel2: {
        marginLeft: '0px',
        fontWeight: 'normal',
        width: '25%'
    },
    columnLabel21: {
        marginLeft: '0px',
        fontWeight: 'normal',
        width: '15%'
    },
    columnLabel3: {
        marginLeft: '0px',
        fontWeight: 'normal',
        width: '25%'

    },
    columnLabel0: {
        marginLeft: '0px',
        fontWeight: 'normal',
        width: '1%'

    },
    docTitle: {
        marginLeft: '0px',
        fontWeight: 'normal',
        width: '75%',
        color: '#000000',
        fontSize: 16,
    }
    , docStatusLabel: {
        marginRight: '0px',
        width: '25%',
        fontFamily: 'Arial'

    }
    , docStatusText: {
        marginLeft: '0px',
        fontWeight: 'normal',
        width: '22%',
        color: '#000080',
        fontFamily: 'Verdana'

    }
};


const TableCellNoLine = withStyles({
    root: {
        borderBottom: "none",
    }
})(MuiTableCell);

class DocumentAsociat extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            selectedDocument: '',
            showAddPanel: false,
            dataStartDoc: new Date(),
            dataStopDoc: new Date().setFullYear(2099),
            furnizorArt: '',
            savingDocument: false,
            statusDocument: 'Nealocat',
            documentAlocat: false,
            listFurnizori: [{ codFurnizor: '-1', numeFurnizor: 'Selectati un furnizor' }],
            furnizorSel: '-1',
            listDocumente: [],
            isNrSarja: false,
            nrSarja: '',
            filialaSel: 'NN10',
            listArticole: [],
            statusSaveArtSint: '',
            checkNrSarje: false,
            nrSarjeMultiple: '',
            openDialog: false

        }

        this.salveazaDocument = this.salveazaDocument.bind(this);
        this.adaugaDocument = this.adaugaDocument.bind(this);
        this.handleDateStartChange = this.handleDateStartChange.bind(this);
        this.handleDateStopChange = this.handleDateStopChange.bind(this);
        this.afiseazaDocument = this.afiseazaDocument.bind(this);
        this.handleSelectedFurnizor = this.handleSelectedFurnizor.bind(this);
        this.nrSarjaChange = this.nrSarjaChange.bind(this);
        this.handleSelectedFiliala = this.handleSelectedFiliala.bind(this);
        this.isUserSelectFiliala = this.isUserSelectFiliala.bind(this);
        this.handleCheckNrSarje = this.handleCheckNrSarje.bind(this);
        this.handleAreaSarjeChange = this.handleAreaSarjeChange.bind(this);
        this.handleToOpenDialog = this.handleToOpenDialog.bind(this);
        this.handleToCloseDialog = this.handleToCloseDialog.bind(this);

    }

    componentDidMount() {

        this.setState(() => {
            return {
                documentAlocat: this.props.docAlocat,
                listDocumente: this.props.listDocumente,
                isNrSarja: this.props.isNrSarja,
                listArticole: this.props.listArticole


            }
        });

    }


    componentWillReceiveProps(nextProps) {

        if (nextProps.articol !== this.props.articol) {
            this.setState(() => {
                return {
                    documentAlocat: nextProps.docAlocat,
                    listDocumente: nextProps.listDocumente,
                    isNrSarja: nextProps.isNrSarja,
                    listArticole: nextProps.listArticole

                }
            });
        }

    }

    nrSarjaChange(event) {
        this.setState({ nrSarja: event.target.value });
    }

    handleAreaSarjeChange(event) {
        this.setState({
            nrSarjeMultiple: event.target.value
        });
    }

    handleToOpenDialog() {
        this.setState({ openDialog: true });
    }

    handleToCloseDialog() {
        this.setState({ openDialog: false });
    }

    handleCheckNrSarje(event) {
        this.setState({ checkNrSarje: event.target.checked, nrSarjeMultiple: '', nrSarja: '' });
    }

    handleSelectedFiliala(event) {
        this.setState({
            filialaSel: event.target.value,
        });

    }

    getStatusDocument(dataExpDoc) {

        if (dataExpDoc.setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0))
            return 'Alocat';
        else
            return 'Expirat';
    }

    getFormatedDate(strDate) {
        return strDate.split('.')[2] + '-' + strDate.split('.')[1] + '-' + strDate.split('.')[0];
    }


    salveazaDocument() {

        let localCodArticol = this.props.articol;

        let localNrSarja = this.state.nrSarja;

        if (this.state.checkNrSarje)
            localNrSarja = this.state.nrSarjeMultiple;

        if (this.props.tipArticol === 'artsint' && this.props.listArticole.length === 0) {
            return;
        }

        if (this.props.tipArticol === 'artsint' && this.state.isNrSarja && this.props.listArticole.length > 1 && localNrSarja.trim().length > 0) {
            this.handleToOpenDialog();
            return;
        }

        if (this.props.tipArticol === 'artsint')
            localCodArticol = this.props.listArticole;

        if (this.state.selectedDocument === '')
            return;

        if (this.state.furnizorSel === '-1')
            return;

        if (this.getFilialaDocument() === 'NN10')
            return;



        this.setState({ savingDocument: true });

        const postParams = new FormData()
        postParams.append('file', this.state.selectedDocument);
        postParams.append('articol', localCodArticol);
        postParams.append('tipDocument', this.props.tipDocument.cod);
        postParams.append('dataStart', format(this.state.dataStartDoc, 'dd.MM.yyyy'));
        postParams.append('dataStop', format(this.state.dataStopDoc, 'dd.MM.yyyy'));
        postParams.append('furnizor', this.state.furnizorSel);
        postParams.append('nrSarja', localNrSarja);
        postParams.append('unitLog', this.getFilialaDocument());

        axios.post('/documente/uploadFile', postParams)
            .then(res => {
                this.setStatusSalveaza(res.data);
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.responderEnd);
                    this.setState({ savingDocument: false });
                }
            });
    }


    getFilialaDocument() {
        if (this.isUserSelectFiliala())
            return this.state.filialaSel;
        else
            return UserInfo.getInstance().getUnitLog();
    }


    getDocumenteTip() {



        axios.get('/documente/getDocumenteTip', {
            params: {
                codArticol: this.props.articol,
                tipDocument: this.props.tipDocument.cod
            }
        })
            .then(res => {

                this.setState(() => {
                    return {
                        listDocumente: res.data
                    }
                });

            })
            .catch(error => {
                if (error.response) {
                    console.log(error.responderEnd);
                }
            });

        this.afisListDocumente();

    }

    setStatusSalveaza(response) {

        if (response.succes) {

            this.setState(() => {
                return {
                    savingDocument: false,
                    showAddPanel: false,
                    statusDocument: 'Alocat',
                    documentAlocat: true
                }
            });

            if (this.props.tipArticol === 'artsint')
                this.setState({ statusSaveArtSint: 'Date salvate' });

        } else {
            this.setState(() => {
                return {
                    savingDocument: false,
                    showAddPanel: true,
                    statusDocument: 'Nealocat',
                    documentAlocat: false
                }
            });

            if (this.props.tipArticol === 'artsint')
                this.setState({ statusSaveArtSint: 'Eroare salvare date' });
        }

        if (this.props.tipArticol !== 'artsint')
            this.getDocumenteTip();

    }


    handleDateStartChange(date1) {
        this.setState({ dataStartDoc: date1 });
    }

    handleDateStopChange(date1) {
        this.setState({ dataStopDoc: date1 });
    }

    adaugaDocument() {

        this.setState(() => {
            return {
                showAddPanel: !this.state.showAddPanel,
            }
        });


        if (!this.state.showAddPanel) {
            this.getListFurnizori();
        }

    }

    afiseazaDocument() {

        axios.get('/documente/getDocumentByte', {
            params: {
                codArticol: this.props.articol,
                tipDocument: this.props.tipDocument.cod
            },
            responseType: 'blob',

        })
            .then(res => {

                const file = new Blob([res.data], { type: "application/pdf" });
                const fileURL = URL.createObjectURL(file);
                const pdfWindow = window.open();
                pdfWindow.location.href = fileURL;

                this.setState(() => {
                    return {

                    }
                });


            })
            .catch(error => {
                if (error.response) {
                    console.log(error.responderEnd);
                }
            });

    }

    setSelectedFile(selectedFile) {

        if (selectedFile[0].name.split('.')[1] !== 'pdf') {
            console.log('not pdf');
            return;
        }

        this.setState({ selectedDocument: selectedFile[0] });
    }


    getDocumentIcon() {

        if (this.state.documentAlocat) {

            if (this.state.dataStopDoc.setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)) {
                return <img src={greenBox} alt="Alocat" />
            }
            else
                return <img src={yellowBox} alt="Expirat" />
        }
        else {
            return <img src={redBox} alt="Nealocat" />
        }

    }

    handleSelectedFurnizor(event) {

        this.setState(() => {
            return {
                furnizorSel: event.target.value
            }
        });

    }

    getListFurnizori() {

        axios.get('/documente/getFurnizoriArticol', {
            params: {
                codArticol: this.props.articol,
                tipArticol: this.props.tipArticol
            }
        })
            .then(res => {
                this.setState(() => {
                    return {
                        listFurnizori: res.data
                    }
                });

            })
            .catch(error => {
                if (error.response) {
                    console.log(error.responderEnd);
                }
            });

    }

    afisFurnizori() {

        let emptyList = [{ codFurnizor: '-1', numeFurnizor: 'Selectati un furnizor' }];

        let finalList = emptyList.concat(this.state.listFurnizori);

        let furnizoriList = finalList.length > 0
            && finalList.map((item, i) => {

                let strCodFurnizor = '';
                if (item.codFurnizor !== '-1')
                    strCodFurnizor = item.codFurnizor;

                return (
                    <MenuItem key={i} value={item.codFurnizor}>{strCodFurnizor + ' ' + item.numeFurnizor}</MenuItem>
                )
            }, this);


        return furnizoriList;

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


    afisListDocumente() {

        let documenteList = this.state.listDocumente.length > 0 && this.state.listDocumente.map((doc, i) => {

            let localNrSarja = doc.nrSarja;

            if (this.state.isNrSarja === false)
                localNrSarja = 'false';

            return (
                <DocumentFurnizor key={i} codArticol={this.props.articol} tipDocument={this.props.tipDocument.cod} document={doc} pos={i % 2} nrSarja={localNrSarja}></DocumentFurnizor>
            )

        });

        return documenteList;
    }

    isUserSelectFiliala() {
        return UserInfo.getInstance().getUnitLog() === 'BU90';
    }

    render() {

        const { classes } = this.props;

        let selectDocPanel = <Table size="small">
            <tbody>
                <TableRow>

                    <TableCellNoLine className={classes.columnLabel}>
                        <Button variant="outlined" size="small" onClick={this.adaugaDocument}>Adauga</Button>
                    </TableCellNoLine>

                    <TableCellNoLine className={classes.docStatusText}></TableCellNoLine>

                    <TableCellNoLine className={classes.docStatusText}>
                        {!this.state.showAddPanel ? <div ></div> :
                            <div>
                                <input type="file" id="file" ref="fileUploader" style={{ display: "none" }} />
                                <input type="file" id="filePicker" accept="application/pdf" onChange={(e) => this.setSelectedFile(e.target.files)} />
                            </div>
                        }
                    </TableCellNoLine>
                    <TableCellNoLine>
                        {this.state.savingDocument ? <LoadingSpinner /> : <div></div>}
                    </TableCellNoLine>

                </TableRow>
            </tbody>
        </Table>


        let panelNrSarje = <textarea
            id="names"
            name="hard"
            value={this.state.nrSarjeMultiple}
            cols={25}
            rows={5}
            onChange={this.handleAreaSarjeChange}
            wrap="hard">
        </textarea>

        let nrSarjaPanel = <TableRow>
            <TableCellNoLine className={classes.columnLabel2}>Nr. sarja</TableCellNoLine>
            <TableCellNoLine className={classes.columnLabel2}><TextField className={classes.columnContent} id="nrSarja" onChange={this.nrSarjaChange} value={this.state.nrSarja} /></TableCellNoLine>
            <TableCellNoLine className={classes.columnLabel2}>
                <FormControlLabel
                    control={
                        <Checkbox
                            id='checkSarje'
                            value='checkSarje'
                            onChange={this.handleCheckNrSarje}
                            checked={this.state.checkNrSarje}
                        />
                    }
                    label='Mai multe sarje'
                />
            </TableCellNoLine>
            <TableCellNoLine className={classes.columnLabel0}></TableCellNoLine>
            <TableCellNoLine className={classes.columnLabel3}>{this.state.checkNrSarje ? panelNrSarje : <div></div>}</TableCellNoLine>

        </TableRow>

        let unitLogPanel = <TableRow>
            <TableCellNoLine className={classes.columnLabel2}>Filiala</TableCellNoLine>
            <TableCellNoLine className={classes.columnLabel3}>
                <Select value={this.state.filialaSel} onChange={this.handleSelectedFiliala}>
                    {this.createFilialeItems()}
                </Select>
            </TableCellNoLine>
        </TableRow>


        let valabilitatePanel = <TableRow >
            <TableCellNoLine className={classes.columnLabel2}>Valabil de la </TableCellNoLine>
            <TableCellNoLine className={classes.columnLabel3}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        variant="standard"
                        format="dd.MM.yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        value={this.state.dataStartDoc}
                        onChange={date => this.handleDateStartChange(date)}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    ></KeyboardDatePicker>
                </MuiPickersUtilsProvider>
            </TableCellNoLine>

            <TableCellNoLine className={classes.columnLabel21}>Pana la </TableCellNoLine>
            <TableCellNoLine className={classes.columnLabel3}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        variant="standard"
                        format="dd.MM.yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        value={this.state.dataStopDoc}
                        onChange={date => this.handleDateStopChange(date)}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    ></KeyboardDatePicker>
                </MuiPickersUtilsProvider>
            </TableCellNoLine>
            <TableCellNoLine className={classes.columnLabel3}>
                <Button variant="outlined" size="small" onClick={this.salveazaDocument}>Salveaza</Button>
            </TableCellNoLine>

        </TableRow>


        let noValiditatePanel = <TableRow>
            <TableCellNoLine className={classes.columnLabel2}>Valabil de la </TableCellNoLine>
            <TableCellNoLine className={classes.columnLabel3}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        variant="standard"
                        format="dd.MM.yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        value={this.state.dataStartDoc}
                        onChange={date => this.handleDateStartChange(date)}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    ></KeyboardDatePicker>
                </MuiPickersUtilsProvider>
            </TableCellNoLine>
            <TableCellNoLine className={classes.columnLabel21}></TableCellNoLine>
            <TableCellNoLine className={classes.columnLabel3}>
            </TableCellNoLine>
            <TableCellNoLine className={classes.columnLabel3}>
                <Button variant="outlined" size="small" onClick={this.salveazaDocument}>Salveaza</Button>
            </TableCellNoLine>
        </TableRow>



        let addDocPanel = <Table size="small" >
            <tbody>
                <TableRow >
                    <TableCellNoLine className={classes.columnLabel2}>Furnizor </TableCellNoLine>
                    <TableCellNoLine className={classes.columnLabel3}>
                        <Select value={this.state.furnizorSel} onChange={this.handleSelectedFurnizor}>
                            {this.afisFurnizori()}
                        </Select>
                    </TableCellNoLine>
                </TableRow>
                {this.state.isNrSarja ? nrSarjaPanel : < div ></div>}
                {this.isUserSelectFiliala() ? unitLogPanel : <div></div>}
                {Constants.hasDocumentExpDate(this.props.tipDocument.cod) ? valabilitatePanel : noValiditatePanel}
            </tbody>
        </Table>


        let infoDocPanel = <Table size="small" >
            {this.afisListDocumente()}
        </Table>


        let headerPanel = <Table size="small">
            <tbody>
                <TableRow>
                    <TableCellNoLine className={classes.docTitle}>{this.props.tipDocument.nume}</TableCellNoLine>
                    <TableCellNoLine className={classes.docStatusLabel}>{this.state.statusSaveArtSint}</TableCellNoLine>
                    <TableCellNoLine className={classes.docStatusLabel}></TableCellNoLine>
                    <TableCellNoLine className={classes.docStatusLabel}></TableCellNoLine>
                </TableRow>
            </tbody>
        </Table>


        return (
            <Card className={classes.card}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" component={'span'}>
                        {headerPanel}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary" component={'span'}>
                        {selectDocPanel}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary" component={'span'}>
                        {this.state.showAddPanel ? addDocPanel : < div ></div>}
                        {this.state.documentAlocat && !this.state.showAddPanel ? infoDocPanel : < div ></div>}
                    </Typography>
                </CardContent>
                <Dialog open={this.state.openDialog} onClose={this.handleToClose}>
                    <DialogTitle>{"Atentie!"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Pentru numarul de sarja selectati doar un singur articol.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleToCloseDialog}
                            color="primary" autoFocus>
                            Inchide
                        </Button>
                    </DialogActions>
                </Dialog>
            </Card>
        )
    }


}



export default withStyles(styles)(DocumentAsociat);