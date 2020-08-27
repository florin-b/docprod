import React, { Component } from 'react';


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

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

class Status extends Component {

    getStatus() {
        return this.props.statusInfo.map((eveniment, index) => {
            const { classes } = this.props;

            return (
                <TableRow key={index} style={index % 2 ? { background: "#F8F6FF" } : { background: "white" }}>
                    <TableCell className={classes.body}>{eveniment.id}</TableCell>
                    <TableCell className={classes.body}>{eveniment.codSim}</TableCell>
                    <TableCell className={classes.body}>{eveniment.dataInreg}</TableCell>
                    <TableCell className={classes.body}>{eveniment.stare}</TableCell>
                </TableRow>
            )
        })

    }

    render() {

        const { classes } = this.props;

        let statusEmpty = <div></div>

        let statusData = this.getStatus();

        let statusRes =

            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead >
                        <TableRow >
                            <TableCell className={classes.header}>Cod tableta</TableCell>
                            <TableCell className={classes.header}>Cod sim</TableCell>
                            <TableCell className={classes.header}>Data</TableCell>
                            <TableCell className={classes.header}>Stare</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {statusData}
                    </TableBody>
                    <TableFooter></TableFooter>
                </Table>
            </TableContainer>


        return this.props.statusInfo.length === 0 ? statusEmpty : statusRes;
    }
}

export default withStyles(styles)(Status);