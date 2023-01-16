import { Box, IconButton, makeStyles } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React from 'react';
import Utils from '../../utils/utils';
import { AppContext } from '../common/context/appContext';
import AxiosApi from '../../utils/httpRequestHandler';
import APIConstants from '../../utils/apiConatants';
import { useParams } from 'react-router-dom';
import ToolBar from '../common/toolBar';
import NoteForm from './noteForm';
import AppDialog from '../common/appDialog';
import ConfirmDialog from '../common/confirmDialog';

const useStyles = makeStyles((theme) => ({
    container: {
        padding: 10,
    },
    containerHeader: {
        display: "flex",
        width: "60%",
    },
    noteContainer: {
        marginBottom: 10,
    },
    noteHeader: {
        display: "flex",
        background: "#f0f8ff",
        padding: "4px 10px",
        height: 30,
        fontWeight: 600,
        color: "#333333c7",
        "&:hover .show-events": {
            display: 'flex'
          }
    },
    noteBody: {
        padding: "0px 10px",
    },
    noteEvents: {
        width: "5%",
        display: "flex",
        justifyContent: "flex-end",
        display: "none",
    }
}));

const NotesView = () => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [data, setData] = React.useState([]);
    const object = Utils.getObjectNameFromUrl();
    const isDetailView = Utils.isDetailView();
    const { handleBackDrop } = React.useContext(AppContext);
    const params = useParams();
    const noteFormRef = React.useRef(null);
    const appDialogRef = React.useRef(null);
    const confrmDialogRef = React.useRef(null);


    React.useEffect(() => {
        getDataFromAPI();
    }, []);

    const getDataFromAPI = async (reqParams) => {
        try {
            if (isDetailView) {
                reqParams = reqParams ? { ...reqParams } : {};
                reqParams.parentObject = object;
                reqParams.parentFieldName = "parentRecordId";
                reqParams.parentRecordId = params.id;

                reqParams.orderByFields  = [{fieldName: "createdDate", asc: false}]
            }

            handleBackDrop(true);
            let response = await AxiosApi.getData(APIConstants.NOTES_VIEW_GET, reqParams);
            setData(response.data);
            handleBackDrop(false);
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }
    }

    const addEvt = () => {
        noteFormRef.current.handleOpen();
    }

    const editEvt = (id) => () => {
        if (id && id > 0) {
            noteFormRef.current.handleOpen(id);
        } else {
            appDialogRef.current.handleOpen({ title: "Information Dialog", contentText: "Please select one record!" });
        }
    }
 
    const deleteEvt = (id) => () => {
        if (id && id > 0) {
            confrmDialogRef.current.handleOpen({ title: "Confirmation Dialog", contentText: "Are you confirm to delet data?", callback: deleteData(id) });
        }
    }

    
    const deleteData = (id) => async () => {
        try {
            let response = await AxiosApi.deleteData(APIConstants.NOTES_DELETE + id);
            console.log(response.data);
            getDataFromAPI();
            enqueueSnackbar('This is a success message!', { variant: "success" });

        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }
    }

    const downLoadCSV = () => {

    }

    const onSearchBoxEnterEvent = (fieldName, searchValue) => {
        // setReqParams({ searchFieldName: fieldName, searchFieldValue: searchValue });

        let field = columns.find(f => f.dataField === fieldName);
        if (field) {
          let { dataField, type, keyConstraints, hidden, sort } = field;
          getDataFromAPI({ seacrchFields: [{ dataField, type, value: searchValue }] });
        }
    }

    const toolBarIcon = [
        { name: "ADD", title: "Add Note", onClick: addEvt, },
        // { name: "DELETE", title: "Delete Maintenance", onClick: deleteEvt, }, 
        { name: "PDF", title: "Export to .pdf file", onClick: () => { }, },
        { name: "CSV", title: "Export to .csv file", onClick: downLoadCSV, },
    ];
    return <Box className={classes.container}>
        {/* <div className={classes.containerHeader}>
            
        </div> */}
        <ToolBar
            icons={toolBarIcon}
            search={{ columns: columns, onEnterEvent: onSearchBoxEnterEvent }}
        />
        {data ? data.map(m => <Note data={m} editEvt={editEvt} deleteEvt={deleteEvt}></Note>) : []}
        <NoteForm ref={noteFormRef} parentObject={object.toUpperCase()} parentRecordId={params.id} getListViewData={getDataFromAPI} />
        <AppDialog ref={appDialogRef} maxWidth="xs" />
        <ConfirmDialog ref={confrmDialogRef} />
    </Box>
}

export default NotesView;

const Note = ({data, editEvt=()=>{}, deleteEvt=()=>{}}) => {
    const classes = useStyles();

    return <Box className={classes.noteContainer}>
        <Box className={classes.noteHeader}>
            <Box style={{width: "95%"}}>Type: {data.noteType}, Title: {data.title}, Author: {data.createdByName}, Date: {data.modifiedDate}</Box>
            {data.noteType != "SYSTEM" && <NoteEvents editEvt={editEvt(data.id)} deleteEvt={deleteEvt(data.id)}/>}
        </Box>
        <Box className={classes.noteBody}>
            <p dangerouslySetInnerHTML={{__html: data.noteText.replace(/\n/g, "<br />")}}/>
        </Box>
    </Box>
}

const NoteEvents = ({deleteEvt=()=>{}, editEvt=()=>{}}) => {
    const classes = useStyles();

    return <Box className={`${classes.noteEvents} show-events`}>
        <span style={{cursor: "pointer"}} onClick={editEvt}><i className="fa fa-pencil" aria-hidden="true"></i></span>
        <span style={{width: 10}}></span>
        <span style={{cursor: "pointer"}} onClick={deleteEvt}><i className="fa fa-trash" aria-hidden="true"></i></span>
    </Box>
}



const columns = [{
    dataField: 'id',
    text: 'ID',
    type: "NUMBER",
    hidden: true,
}, {
    dataField: 'title',
    text: 'Title',
    type: "TEXT",
    headerStyle: { width: 50, },
    headerAttrs: { title: 'Title' }
}, {
    dataField: 'noteText',
    text: 'Note Text',
    type: "TEXT",
    headerStyle: { width: 70, },
    headerAttrs: { title: 'Note Text' }
},

];

