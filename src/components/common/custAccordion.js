import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Box } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: "inherit",
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    // fontSize: "inherit",
    color: theme.palette.text.secondary,
  },
  expanded: {
      margin: 5
  }
}));

const CustAccordion = ({list=[]}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
    
  return (
    <div className={classes.root}>
      {list && list.map(m => <AccordionComponent expanded={expanded} handleChange={handleChange} props={m}><div>PPP</div></AccordionComponent>)}
      
    </div>
  );
}


export default CustAccordion;

const AccordionComponent = ({expanded, handleChange,  props}) => {
    const classes = useStyles();

    let {name, summary, children} = props;
    let { heading, secondaryHeading} = summary;

    return <Accordion expanded={expanded === name} onChange={handleChange(name)} >
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1bh-content"
      id="panel1bh-header"
      //classes={clsx(classes.expanded)}
    >
      <Typography className={classes.heading}>{heading}</Typography>
      <Typography className={classes.secondaryHeading}>{secondaryHeading}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Box style={{width: "100%"}}>{children}</Box>
    </AccordionDetails>
  </Accordion>
}

{/* <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography className={classes.heading}>Users</Typography>
          <Typography className={classes.secondaryHeading}>
            You are currently not an owner
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus, varius pulvinar
            diam eros in elit. Pellentesque convallis laoreet laoreet.
          </Typography>
        </AccordionDetails>
      </Accordion> */}