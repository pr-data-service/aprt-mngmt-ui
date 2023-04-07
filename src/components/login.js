import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, Grid, Paper } from '@material-ui/core';
import { SelectField, TextField } from './common/fields';
import { Link, useNavigate } from 'react-router-dom';
import APIConstants from '../utils/apiConatants';
import AxiosApi from '../utils/httpRequestHandler';
import { useSnackbar } from 'notistack';
import { AppContext } from './common/context/appContext';

const useStyles = makeStyles((theme) => ({
    container: {
        top: "50%",
        left: "47%",
        position: "fixed",
        marginTop: "-11em",
        marginLeft: "-15em",
    },
    subContainer: {
        width: 500,
        height: 300,
        padding: 20,
        display: "flex"
    },
    subContainer1: {
        // padding: "20px 60px",
        width: 200
    },
    subContainer2: {
        // padding: "20px 60px",
        width: "100%"
    },
    title: {
        fontSize: 26,
        // padding: "0px 0px 20px 0px"
    },
    field: {
        width: "100%"
    },
    actionArea: {
        display: "flex",
        justifyContent: "right"
    },
    register: {
        fontSize: 11
    },
    icon: {
        fontSize: 150,
        margin: "59px 0px"
    },
    sessionList: {
        width: "100%",
        marginTop: -23
    }
}));

const Login = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [data, setData] = React.useState(null);
    const [sessionList, setSessionList] = React.useState([]);
    const [sessionId, setSessionId] = React.useState(0);
    const { handleBackDrop } = React.useContext(AppContext);

    React.useEffect(() => {
        let token = localStorage.getItem("token");
        if (token) {
            navigate("/");
        }
    }, [])

    const login = async () => {
        try {
            handleBackDrop(true);
            let data = { username, password };
            let response = await AxiosApi.postData(APIConstants.APP_LOGIN, data);            
            handleBackDrop(false);

            const { token, sessionList} = response.data;
            let list = sessionList ? sessionList.map( m => { return {value: m.id, text: m.name}}) : []
            list.unshift({value: ' ', text: "----Select Session----"});
            setSessionList(list);
            setData(response.data);
        } catch (error) {
            handleBackDrop(false);
            console.error(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }
    }

    const onKeyDown = (event) => {
        if (event.key === 'Enter') {
            console.log('do validate');
            login();
          }
    }

    const handleChange = (event) => {
        setSessionId(event.target.value);

        localStorage.setItem("token", data.token);
        localStorage.setItem("session-id", event.target.value);

        let session = data.sessionList ? data.sessionList.find( f => f.id == event.target.value) : null;
        localStorage.setItem("session", JSON.stringify(session));
        navigate("/");    
    }

    return <Box className={classes.container} onKeyDown={onKeyDown}>
        <Paper elevation={2} className={classes.subContainer}>
            {/* <Grid container spacing={1} className={classes.subContainer1}>
                <i className={`${'fa fa-sign-in'} ${classes.icon}`} aria-hidden="true"></i>
            </Grid> */}
            <Grid container spacing={0} className={classes.subContainer2}>
                <Grid item xs={12}>
                    <Box className={classes.title}>Welcome back!</Box>
                </Grid>
                {sessionList.length <= 0 && <>
                <Grid item xs={12}>
                    <TextField
                        label="User ID"
                        id="outlined-size-small"
                        defaultValue="9830454323"
                        variant="outlined"
                        size="small"
                        className={classes.field}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Password"
                        id="outlined-size-small"
                        defaultValue="9830454323"
                        variant="outlined"
                        size="small"
                        className={classes.field}
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Grid>
                <Grid item xs={9}>
                    <Box className={classes.register}>Do not have account? <a href="/register">Click here to Register</a></Box>
                </Grid>
                <Grid item xs={3}>
                    <Box className={classes.actionArea}><Button color="primary" variant="outlined" onClick={login} onKeyDown={onKeyDown}>Login</Button></Box>
                </Grid>
                </>}

                { sessionList.length > 0 && <>
                    <Grid item xs={12}>
                        <SelectField name="sessionList" label="Session List" value={sessionId} options={sessionList} style={{ width: "100%" }} className={classes.sessionList} onChange={handleChange} /> 
                    </Grid>
                </>}
            </Grid>

        </Paper>
    </Box>

}

export default Login;