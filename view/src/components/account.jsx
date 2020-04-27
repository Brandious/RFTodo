import React, { Component } from 'react'

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import CircuralProgress from '@material-ui/core/CircularProgress'


const styles = ((theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    toolbar: theme.mixins.toolbar,
    })
);

class account extends Component {
    render() {
        const { classes } = this.props;
        return (
            <main className={classes.content}>
            <div className={classes.toolbar} />
            <Typography paragraph>
                Hello I am Account
            </Typography>
            </main>
        )
    }
}

export default (withStyles(styles)(account));