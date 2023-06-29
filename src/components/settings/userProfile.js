import { Box, Button, Card, CardMedia, Grid, Input, makeStyles } from '@material-ui/core';
import AxiosApi from '../../utils/httpRequestHandler';
import React from 'react';
import APIConstants from '../../utils/apiConatants';
import FormBuilder from '../common/formBuilder';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';


const useStyles = makeStyles(() => ({
    header: {
        color: "#0a0b0b85",
        fontWeight: "bold",
        fontSize: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    detailsContainer: {
        marginRight: 20,
        width: '70%',
    },
    passwordContainer: {
        width: '25%',
    },
    signatureContainer: {
        width: '26%',
    },
    fields: {
        display: 'flex',
        justifyContent: 'space-Between',
        width: '100%',
        height: 30,
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
    mainContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        paddingLeft: 10,
        paddingRight: 10
    },
    fieldLable: {
        textAlign: "right"
    },
    card: {
        maxWidth: 300,
        height: 50,
        margin: 'auto'
    },
    signImage: {
        maxHeight: '50px',
        maxWidth: '100%',
        width: 'auto',
        height: 'auto',
    },
    textPreview: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '50px',
        color: 'black'
    }
}));


const UserProfile = () => {
    let classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [data, setData] = React.useState(Object);
    const [file, setFile] = React.useState(null);
    const [signImgUrl, setSignImgUrl] = React.useState("");
    const methods = useForm({
        criteriaMode: "all"
    });

    React.useEffect(() => {
        getDataFromAPI();
        getSigImage();
    }, []);

    const getDataFromAPI = async () => {
        try {
            let response = await AxiosApi.getData(APIConstants.USER_LOGGEDIN_GET);
            setData(response.data);
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }

    }

    const getSigImage = async () => {
        try {
            let response = await AxiosApi.getImgFileUrl(APIConstants.USER_SIGNATURE_GET);
            setSignImgUrl(response.data);
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    const onImageSubmit = async (e) => {
        try {
            e.preventDefault();
            let response = await AxiosApi.uploadFile(APIConstants.USER_SIGNATURE_UPLOAD, file);
            enqueueSnackbar(response.message, { variant: "success" });
            getSigImage();
        } catch (error) {
            console.log(error);
            enqueueSnackbar(error.message, { variant: "error" });
        }
    }

    const onPasswordSubmit = async (obj) => {
        try {
            obj.id = data.id;
            console.log(obj);
            let response = await AxiosApi.postData(APIConstants.USER_UPDATE_PASSWORD, obj);
            console.log(response);
            enqueueSnackbar("Password successfully updated.", { variant: "success" });
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }
    }

    return <Box className={classes.mainContainer}>
        <Box className={classes.detailsContainer}>
            <Grid className={classes.header}>User Details</Grid>
            {Object.keys(fieldLabels).map((e, index) => {
                return <Grid className={classes.fields} style={(index % 2 == 0) ? { background: '#e5e5e563' } : {}} key={index + 'k'}>
                    <Grid item xs={3}>{fieldLabels[e]}</Grid><Grid item xs={9} className={classes.fieldLable}>{data[e]}</Grid>
                </Grid>
            })}
        </Box>
        <Box className={classes.passwordContainer}>
            <Grid className={classes.header}>Change Password</Grid>
            <Grid>
                <FormBuilder fields={fields} onSubmit={onPasswordSubmit} gridItemXS={12} submitButton={<Button type="submit" color="primary" variant='outlined'> Save </Button>} />
            </Grid>
        </Box>
        <Box className={classes.signatureContainer}>
            <Grid className={classes.header}>User Signature</Grid>

            <Grid>
                <Card className={classes.card}> 
                    <CardMedia 
                        className={classes.signImage}
                        title="Image Preview" 
                        component= {() =><Signature classes={classes} signImgUrl={signImgUrl}/>} 
                    />
                </Card>    
                <form onSubmit={onImageSubmit}>
                    <Input
                        name='signatureImage'
                        type='file'
                        onChange={handleFileChange}
                    />
                    <Button
                        style={{ marginTop: '10px', backgroundColor: 'white' }}
                        type='submit'
                        variant='outlined'
                        color='primary'
                    >
                        Upload
                    </Button>
                </form>
            </Grid>
        </Box>
    </Box>
}

export default UserProfile;

const Signature = ({classes, signImgUrl}) => {
    let props = {component: "img", src: signImgUrl};
    console.log(signImgUrl);
    if(!signImgUrl) {
        props = {component: () => <SignatureNotfoundabel/>};
    }
    return <CardMedia className={classes.signImage} title="Image Preview" {...props} />
}

const SignatureNotfoundabel = () => {
    return <div style={{padding: "14px 25%"}}>
        Signature Not Found
    </div>
}

const fields = [
    { "name": "oldPassword", label: "Old Password", defaultValue: "", "type": "PASSWORD", "isHeaden": false },
    { "name": "newPassword", label: "New Password", defaultValue: "", "type": "PASSWORD", "isHeaden": false },
    { "name": "confirmPassword", label: "Confirm Password", defaultValue: "", "type": "PASSWORD", "isHeaden": false },
]

const signatureField = [
    { "name": "image", label: "Signature Image", defaultValue: null, "type": "FILE" }
]

const fieldLabels = {
    firstName: "First Name",
    lastName: "Last Name",
    contactNo1: "Phone Number 1",
    contactNo2: "Phone Number 2",
    userAddress: "User Address:",
    role: "Role",
};