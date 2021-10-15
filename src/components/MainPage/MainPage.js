import React, { Component } from 'react';
import Sidebar from '../UI/Sidebar/Sidebar';
import UserInfo from '../Data/UserInfo';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { withStyles } from '@material-ui/core/styles';
import PageHeader from '../UI/PageHeader/PageHeader';
import CardMedia from '@material-ui/core/CardMedia';
import documentsIcon from '../../images/my_documents.png';
import Paper from '@material-ui/core/Paper';
import { Redirect } from 'react-router';
import AppLogo from '../UI/AppLogo/AppLogo';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import MuiTableCell from "@material-ui/core/TableCell";

const styles = {
    pageContent: {
        marginTop: '20px',
        marginLeft: '50px',
        justifyContent: "center",
        alignItems: "center"
    },
    drawerPaper: {
        backgroundImage: { documentsIcon }
    }
};

const TableCellNoLine = withStyles({
    root: {
        borderBottom: "none",
        color: '#80809f',
        fontWeight: 'bold',
        width: '30%'

    }
})(MuiTableCell);


class MainPage extends Component {



    render() {

        const { classes } = this.props;

        if (UserInfo.myInstance != null) {
            return (
                <div>
                    <Container fluid >
                        <Row>
                            <Col xs={2}><AppLogo /></Col>
                            <Col xs={9}><PageHeader /></Col>
                        </Row>
                        <Row>
                            <Col xs={2}><Sidebar items={UserInfo.getInstance().getMenuItems()} /></Col>
                            <Col xs={9}><div className={classes.pageContent}>
                                <Paper >
                                    <TableContainer>
                                        <Table size="small">
                                            <tbody>
                                                <TableRow>
                                                    <TableCellNoLine ></TableCellNoLine>
                                                    <TableCellNoLine>
                                                        <CardMedia >
                                                            <img src={documentsIcon} alt="recipe thumbnail" />
                                                        </CardMedia>
                                                    </TableCellNoLine>
                                                    <TableCellNoLine ></TableCellNoLine>
                                                </TableRow>
                                            </tbody>
                                        </Table>
                                    </TableContainer>


                                </Paper>
                            </div></Col>
                        </Row>
                    </Container>


                </div>

            )
        } else {
            return (<Redirect to='/docuser' />);
        }
    }

}

export default withStyles(styles)(MainPage);