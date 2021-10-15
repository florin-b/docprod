import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Constants from '../Data/Constants';

const styles = {
    body: {
        color: '#80809f'
    },
    header: {
        background: '#6C7AE0',
        color: 'white',
        fontWeight: 'bold'
    }
};


class Tabel extends React.Component {


    getTabelData() {

        return this.props.statusInfo.map((raport, index) => {
            const { classes } = this.props;

            return (
                <TableRow key={index} style={index % 2 ? { background: "#F8F6FF" } : { background: "white" }}>
                    <TableCell className={classes.body}>{raport.codReper}</TableCell>
                    <TableCell className={classes.body}>{raport.numeReper}</TableCell>
                    <TableCell className={classes.body}>{this.getNumeDocument(raport.tipDocument)}</TableCell>
                    <TableCell className={classes.body}>{raport.dataStartValid}</TableCell>
                    <TableCell className={classes.body}>{raport.dataStopValid}</TableCell>
                    <TableCell className={classes.body}>{raport.nrSarja}</TableCell>
                    <TableCell className={classes.body}>{raport.filiala}</TableCell>
                </TableRow>
            )
        })

    }


    getNumeDocument(tipDocument) {
        let numeDoc = 'Nedefinit';

        Constants.tipDocumenteArticol.forEach((item, i) => {
            if (tipDocument === item.cod)
                numeDoc = item.nume;
        });


        return numeDoc;
    }


    render() {

        const { classes } = this.props;

        let tabelEmpty = <div></div>

        let tabelData = this.getTabelData();

        let tabelRes =

            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead >
                        <TableRow >
                            <TableCell className={classes.header}>Cod reper</TableCell>
                            <TableCell className={classes.header}>Nume reper</TableCell>
                            <TableCell className={classes.header}>Tip document</TableCell>
                            <TableCell className={classes.header}>Valid de la</TableCell>
                            <TableCell className={classes.header}>Pana la</TableCell>
                            <TableCell className={classes.header}>Sarja</TableCell>
                            <TableCell className={classes.header}>Filiala</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tabelData}
                    </TableBody>
                    <TableFooter></TableFooter>
                </Table>
            </TableContainer>


        return this.props.statusInfo.length === 0 ? tabelEmpty : tabelRes;

    }
}

export default withStyles(styles)(Tabel);