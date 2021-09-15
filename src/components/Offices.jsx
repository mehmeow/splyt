import React from 'react';
import { Tabs, Tab, FormControlLabel, Switch, Slider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  buttonWrapper: {
    position: 'absolute',
    width: '100%',
    top: 0,
    zIndex: 999,
    paddingTop:20,
    paddingBottom:50,
    background:'#fff',
    background: 'linear-gradient(180deg, rgba(255,255,255,1) 20%, rgba(255,255,255,1) 30%, rgba(255,255,255,0.1783088235294118) 90%)',
    textAlign:'center'
  },
  buttonWrapperInner: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttonGroup: {
    marginRight: 20
  },
  slider:{
    marginTop:20,
    width:'100%!important',
    maxWidth:'500px!important'
  }
});

const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#52d869',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

const IOSSlider = withStyles({
  root: {},
  thumb: {
    height: 28,
    width: 28,
    backgroundColor: '#fff',
    boxShadow: iOSBoxShadow,
    marginTop: -14,
    marginLeft: -14,
    '&:focus, &:hover, &$active': {
      boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: iOSBoxShadow,
      },
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 12px)',
    top: -22,
    '& *': {
      background: '#fff',
      color: '#000',
      fontWeight:'bold'
    },
  },
  track: {
    height: 3,
  },
  rail: {
    height: 3,
    opacity: 0.5,
    backgroundColor: '#bfbfbf',
  },
  mark: {
    height: 3,
  },
})(Slider);


const Offices = ({ officesList, selectedBranch, setBranch, getTaxi, setGetTaxi, count, setCount }) => {
  const classes = useStyles();

  return (
    <div className={classes.buttonWrapper}>
      <div className={classes.buttonWrapperInner}>
        <Tabs
          value={selectedBranch}
          indicatorColor="primary"
          textColor="primary"
          // onChange={(event, newValue) => setValue(newValue)}
          onChange={(e, newKey) => setBranch(newKey)}
          aria-label="Offices Location"
          className={classes.buttonGroup}
        >
          {
            Object.keys(officesList).map((branchKey, i) => {
              return (
                <Tab key={i} className={classes.myButton} label={officesList[branchKey].branch} value={branchKey} />
              )
            })
          }
        </Tabs>
        <FormControlLabel
          control={<IOSSwitch checked={getTaxi} onChange={()=>setGetTaxi(!getTaxi)} name="get_taxi" />}
          label="Get Taxis"
        />
      </div>
      {getTaxi && <IOSSlider
        classes={{root:classes.slider}}
        defaultValue={count}
        getAriaValueText={(value)=>value}
        aria-labelledby="discrete-slider-small-steps ios slider"
        step={1}
        marks
        min={1}
        max={20}
        valueLabelDisplay="auto"
        onChangeCommitted={(e, val)=>setCount(val)}
      />}
    </div>
  )
}
export default Offices;