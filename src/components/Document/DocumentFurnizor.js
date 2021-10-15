import React from 'react';
import { TableRow } from '@material-ui/core';
import MuiTableCell from "@material-ui/core/TableCell";
import { withStyles } from '@material-ui/core/styles';
import { format } from "date-fns";
import Button from '@material-ui/core/Button';
import axios from 'axios';

import greenBox from '../../images/Box_green.png';
import yellowBox from '../../images/Box_yellow.png';

const TableCellNoLine = withStyles({
    root: {
        borderBottom: "none",
    }
})(MuiTableCell);


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

    }, columnLabel3Bold: {
        marginLeft: '0px',
        fontWeight: 'bold',
        width: '25%'
    }
    , docTitle: {
        marginLeft: '0px',
        fontWeight: 'normal',
        width: '75%',
        color: '#000000',
        fontSize: 16,
    }
    , docStatusLabel: {
        width: '25%'
    }
    , docStatusText: {
        marginLeft: '0px',
        fontWeight: 'normal',
        width: '22%',
        color: '#000080',
        fontFamily: 'Verdana'

    }, rowPar: {
        backgroundColor: '#FAFAFA'
    }, rowImpar: {
        backgroundColor: '#eaeded'
    }
};

class DocumentFurnizor extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dataStopVal: new Date(),
            statusDocument: 'Nealocat',
            documentAlocat: false,
            nrSarja: '',
            docSters: false
        }

        this.afiseazaDocument = this.afiseazaDocument.bind(this);
        this.stergeDocument = this.stergeDocument.bind(this);
        this.handleStergeDocument = this.handleStergeDocument.bind(this);
    }


    getStatusDocument() {

        let dataExpDoc = new Date(this.getFormatedDate(this.props.document.dataStopVal));

        if (dataExpDoc.setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0))
            return 'Valid';
        else
            return 'Expirat';

    }

    getFormatedDate(strDate) {
        return strDate.split('.')[2] + '-' + strDate.split('.')[1] + '-' + strDate.split('.')[0];
    }

    componentDidMount() {

        this.setState(() => {
            return {
                documentAlocat: this.props.docAlocat,
                statusDocument: this.props.docAlocat ? this.getStatusDocument(new Date(this.getFormatedDate(this.props.document.dataStopVal))) : 'Nealocat',
                nrSarja: this.props.nrSarja

            }
        });
    }


    componentWillReceiveProps(nextProps) {

        this.setState(() => {
            return {
                documentAlocat: this.props.docAlocat,
                nrSarja: this.props.nrSarja
            }
        });


    }


    getDocumentIcon() {

        let dataExpDoc = new Date(this.getFormatedDate(this.props.document.dataStopVal));

        if (dataExpDoc.setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)) {
            return <img src={greenBox} alt="Alocat" />
        }
        else
            return <img src={yellowBox} alt="Expirat" />

    }



    stergeDocument() {

        let paramNrSarja = this.state.nrSarja === 'false' ? '-1' : this.state.nrSarja;

        const postParams = new FormData()
        postParams.append('codArticol', this.props.codArticol);
        postParams.append('codSarja', paramNrSarja);
        postParams.append('tipDocument', this.props.tipDocument);
        postParams.append('codFurnizor', this.props.document.codFurnizor);
        postParams.append('startValid', this.props.document.dataStartVal);
        postParams.append('stopValid', this.props.document.dataStopVal);

        axios.post('/documente/stergeDocument', postParams
        )
            .then(res => {
                this.handleStergeDocument(res.data);
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.responderEnd);
                }
            });


    }


    handleStergeDocument(response) {

        if (response.succes) {
            this.setState({ docSters: true });
            console.log('succes!');
        }
        else {
            this.setState({ docSters: false });
            console.log('not succes!');
        }
    }

    afiseazaDocument() {

        axios.get('/documente/getDocumentByte', {
            params: {
                codArticol: this.props.codArticol,
                tipDocument: this.props.tipDocument,
                codFurnizor: this.props.document.codFurnizor
            },
            responseType: 'blob',

        })
            .then(res => {

                const blob = new Blob([res.data], { type: "application/pdf" });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = this.getNumeDocument();
                link.click();

            })
            .catch(error => {
                if (error.response) {
                    console.log(error.responderEnd);
                }
            });

    }


    getNumeDocument() {
        return "Document.pdf";

    }




    render() {

        const { classes } = this.props;


        let nrSarjaPanel = <TableRow>
            <TableCellNoLine className={classes.columnLabel2}>Nr. sarja </TableCellNoLine>
            <TableCellNoLine className={classes.columnLabel3Bold}>{this.state.nrSarja}</TableCellNoLine>
            <TableCellNoLine className={classes.columnLabel3}></TableCellNoLine>
            <TableCellNoLine className={classes.columnLabel3Bold}></TableCellNoLine>
            <TableCellNoLine className={classes.docStatusLabel}></TableCellNoLine>
        </TableRow>


        let responsePanel = <div>
            <tbody>
                <TableRow >
                    <TableCellNoLine className={classes.columnLabel2}>Furnizor</TableCellNoLine>
                    <TableCellNoLine className={classes.columnLabel3Bold}>{this.props.document.numeFurnizor}</TableCellNoLine>
                    <TableCellNoLine className={classes.columnLabel3}><Button variant="outlined" size="small" onClick={this.stergeDocument}>Sterge</Button></TableCellNoLine>
                    <TableCellNoLine className={classes.columnLabel3Bold}><Button variant="outlined" size="small" onClick={this.afiseazaDocument}>Afiseaza</Button></TableCellNoLine>
                    <TableCellNoLine className={classes.docStatusLabel}>{this.getDocumentIcon()}</TableCellNoLine>
                </TableRow>
                {this.state.nrSarja === 'false' ? <div></div> : nrSarjaPanel}
                <TableRow >
                    <TableCellNoLine className={classes.columnLabel2}>Valabil de la </TableCellNoLine>
                    <TableCellNoLine className={classes.columnLabel3}>
                        {format(new Date(this.getFormatedDate(this.props.document.dataStartVal)), 'dd.MM.yyyy')}
                    </TableCellNoLine>
                    <TableCellNoLine className={classes.columnLabel21}>Pana la </TableCellNoLine>
                    <TableCellNoLine className={classes.columnLabel3}>
                        {format(new Date(this.getFormatedDate(this.props.document.dataStopVal)), 'dd.MM.yyyy')}
                    </TableCellNoLine>
                    <TableCellNoLine className={classes.columnLabel3}>
                        {this.getStatusDocument()}
                    </TableCellNoLine>
                </TableRow>
            </tbody>
        </div>

        if (this.state.docSters)
            responsePanel = <div></div>

        return (
            <tbody className={this.props.pos === 1 ? classes.rowPar : classes.rowImpar}>{responsePanel}</tbody>
        )


    }
}


export default withStyles(styles)(DocumentFurnizor);