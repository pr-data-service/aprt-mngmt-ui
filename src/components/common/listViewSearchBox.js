import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Filter from '../common/filter';


const styles = theme => ({
    select: {
        //maxWidth: 100,
        maxWidth: "30%",
        border: "none",
        borderRight: "1px solid #83818187",
        marginRight: 5,
        '&:focus': {
            outline: "none"
        },
    },
    inputParent: {
        width:350,
        border: "1px solid #83818187",
        margin: "7px 0px",
        padding: 4,
        borderRadius: 3,
        display: "flex"
    },
    input: {
        marginLeft: 5,
        border: "none",
        height: "95%",
        width: '59%',
        '&:focus': {
            // borderColor: '#80bdff',
            // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
            outline: "none"
        },
    },
    searchIcon: {
        cursor: 'pointer',
        marginTop: 3
    },
    filterIcon: {
        cursor: 'pointer',
        marginTop: 3
    }
});


const ListViewSearchBox = ({ object, classes, fields, onSearchEvent }) => {
    const arrFields = fields.filter( f => !f.hidden && f.type !== "DATE" && f.type !== "EMPTY"
                                    && f.dataField !== "createdByName" && f.dataField !== "modifiedByName");
    const [fieldName, setFieldName] = React.useState(getFirstFiled(arrFields));
    const [fieldValue, setFieldValue] = React.useState("");
    const [anchorEl, setAnchorEl] = React.useState(null);

    React.useEffect(() => {
        console.log("search-fieldName: " + fieldName, "search-fieldValue: " + fieldValue);
    }, [fieldName, fieldValue]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          console.log('do validate');
          if(onSearchEvent && onSearchEvent instanceof Function) {
            let fld = arrFields.find(f => f.dataField == fieldName);
            onSearchEvent([{dataField: fld.dataField, type: fld.type, value: fieldValue}]);
          }
        }
      }

      const handleFilter = (event) => {
        setAnchorEl(event ? event.currentTarget : null);
      };
    
      let filterFilds = fields.filter(f => !f.hidden && f.type == "DATE");
    return <div className={classes.inputParent}>
        <select className={classes.select} onChange={e => setFieldName(e.currentTarget.value)} title={fieldValue ? fieldValue : ""}>
            {arrFields && arrFields.map(m => <option value={m.dataField} title={m.text}>{m.text}</option>)}
        </select>
        <i className={`fa fa-search ${classes.searchIcon}`} aria-hidden="true"></i>
        <input style={{}} 
            className={classes.input} 
            placeholder='Type text here....' 
            title="Type text here & press enter to search."
            onChange={e => setFieldValue(e.currentTarget.value)}
            onKeyDown={handleKeyDown}></input>
        {(filterFilds && filterFilds.length > 0) && <i className={`fa fa-filter ${classes.filterIcon}`} aria-hidden="true" onClick={handleFilter} title="Click here to open Custom Filter"></i>}
        { (anchorEl) && <Filter anchorEl={anchorEl} handleClose={handleFilter} object={object} fields={filterFilds} onSearchEvent={onSearchEvent}/> }
    </div>
}


export default withStyles(styles)(ListViewSearchBox); 

const getFirstFiled = (arrFields) => {
    if(arrFields) {
        let arr = arrFields.filter( f => !f.hidden);
        if(arr.length > 0) {
            return arr[0].dataField
        }
    }
    return "";
}