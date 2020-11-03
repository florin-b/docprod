import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    paper: {
        marginTop: '15px',
        background: '#6c7ae0',
        height: '50px',
        textAlign: 'center',
        verticalAlign: 'middle',
        lineHeight: '50px',
        fontFamily: 'Roboto',
        color: '#ffffff',
        fontSize: '17px',
        width: '220px'
    }
};


class AppLogo extends Component {

    render() {

        const { classes } = this.props;

        return (
            <Paper className={classes.paper}>DOCUMENTATIE PRODUSE</Paper>
        )
    }

}

export default withStyles(styles)(AppLogo);