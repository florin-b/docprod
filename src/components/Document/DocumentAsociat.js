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
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

import { format } from "date-fns";
import LoadingSpinner from '../UI/LoadingSpinner/LoadingSpinner';
import redBox from '../../images/Box_red.png';
import greenBox from '../../images/Box_green.png';
import yellowBox from '../../images/Box_yellow.png';

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
    columnLabel3: {
        marginLeft: '0px',
        fontWeight: 'normal',
        width: '25%'

    }, docTitle: {
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
            dataStopDoc: new Date(),
            savingDocument: false,
            statusDocument: 'Nealocat',
            documentAlocat: false
        }


        this.salveazaDocument = this.salveazaDocument.bind(this);
        this.adaugaDocument = this.adaugaDocument.bind(this);
        this.handleDateStartChange = this.handleDateStartChange.bind(this);
        this.handleDateStopChange = this.handleDateStopChange.bind(this);
        this.afiseazaDocument = this.afiseazaDocument.bind(this);


    }

    componentDidMount() {

        this.setState(() => {
            return {
                documentAlocat: this.props.docAlocat,
                statusDocument: this.props.docAlocat ? this.getStatusDocument(new Date(this.getFormatedDate(this.props.docStopValid))) : 'Nealocat',
                dataStartDoc: new Date(this.getFormatedDate(this.props.docStartValid)),
                dataStopDoc: new Date(this.getFormatedDate(this.props.docStopValid))
            }
        });

    }


    componentWillReceiveProps(nextProps) {

        if (nextProps.articol !== this.props.articol) {
            this.setState(() => {
                return {
                    documentAlocat: nextProps.docAlocat,
                    statusDocument: nextProps.docAlocat ? this.getStatusDocument(new Date(this.getFormatedDate(nextProps.docStopValid))) : 'Nealocat',
                    dataStartDoc: new Date(this.getFormatedDate(nextProps.docStartValid)),
                    dataStopDoc: new Date(this.getFormatedDate(nextProps.docStopValid))

                }
            });
        }

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

        if (this.state.selectedDocument === '')
            return;

        this.setState({ savingDocument: true });

        const postParams = new FormData()
        postParams.append('file', this.state.selectedDocument);
        postParams.append('articol', this.props.articol);
        postParams.append('tipDocument', this.props.tipDocument.cod);
        postParams.append('dataStart', format(this.state.dataStartDoc, 'dd.MM.yyyy'));
        postParams.append('dataStop', format(this.state.dataStopDoc, 'dd.MM.yyyy'));

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
        }

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
            //return;
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

    render() {


        const { classes } = this.props;

        let selectDocPanel = <Table size="small">
            <TableRow>
                <TableCellNoLine className={classes.docStatusText}>{this.state.statusDocument}</TableCellNoLine>

                <TableCellNoLine className={classes.columnLabel}>
                    <Button variant="outlined" size="small" onClick={this.adaugaDocument}>Adauga</Button>
                </TableCellNoLine>

                <TableCellNoLine >
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
        </Table>


        let addDocPanel = <Table size="small" >
            <TableRow >
                <TableCellNoLine className={classes.columnLabel2}>Valabil de la </TableCellNoLine>
                <TableCellNoLine className={classes.columnLabel3}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} >
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

                <TableCellNoLine className={classes.columnLabel2}>Pana la </TableCellNoLine>
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
        </Table>


        let infoDocPanel = <Table size="small" >
            <TableRow >
                <TableCellNoLine className={classes.columnLabel2}>Valabil de la </TableCellNoLine>
                <TableCellNoLine className={classes.columnLabel3}>
                    {format(this.state.dataStartDoc, 'dd.MM.yyyy')}
                </TableCellNoLine>
                <TableCellNoLine className={classes.columnLabel2}>Pana la </TableCellNoLine>
                <TableCellNoLine className={classes.columnLabel3}>
                    {format(this.state.dataStopDoc, 'dd.MM.yyyy')}
                </TableCellNoLine>
                <TableCellNoLine className={classes.columnLabel3}>
                    <Button variant="outlined" size="small" onClick={this.afiseazaDocument}>Afiseaza</Button>
                </TableCellNoLine>
            </TableRow>
        </Table>


        let headerPanel = <Table size="small">
            <TableRow>
                <TableCellNoLine className={classes.docTitle}>{this.props.tipDocument.nume}</TableCellNoLine>
                <TableCellNoLine className={classes.docStatusLabel}></TableCellNoLine>
                <TableCellNoLine className={classes.docStatusLabel}></TableCellNoLine>
                <TableCellNoLine className={classes.docStatusLabel}>{this.getDocumentIcon()}</TableCellNoLine>

            </TableRow>

        </Table>


        return (
            <div><Card className={classes.card}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary">
                        {headerPanel}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                        {selectDocPanel}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                        {this.state.showAddPanel ? addDocPanel : < div ></div>}
                        {this.state.documentAlocat && !this.state.showAddPanel ? infoDocPanel : < div ></div>}
                    </Typography>
                </CardContent>
            </Card></div >
        )
    }


}



export default withStyles(styles)(DocumentAsociat);