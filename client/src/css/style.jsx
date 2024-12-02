import { makeStyles, useTheme } from '@material-ui/core/styles';

const drawerWidth = 480;
const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      backgroundColor: '#676767',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    hide: { 
      display: 'none',
    },
    drawer: {
      zIndex: 0,
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      marginBottom: 6,
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    flexCol: {
      display:"flex",flexDirection:"column", alignItems: 'center'
    },
    flexCenter:{
      justifyContent:'center', alignItems: 'center'
    },
    flexRow: {
      display:"flex",flexDirection:"row", alignItems: 'center', 
    },
    imgBox: {
      width: "100%",
      height: "200px",
      border: "1px dashed gray",
      display: "flex",
      justifyContent:'center',
      alignItems: 'center'
    },
    reactMarkDown: {
      '& p':{
        fontSize: '16px',
        marginBottom: '1em',
        marginTop: '1em',
      } 
    },
    helpMarkDown: {
      fontSize: '1.1em',
    },
    cancelButton: {
      backgroundColor: '#f7f7f8 !important',
      color: '#800080 !important', //800080
      border: '1px solid #800080 !important',
      '&:hover': {
        backgroundColor: '#fff !important',
      },
    },
    labelDrawer: {
      backgroundColor: '#2e1534', //'#212121'
    },
    tableRoot: {
      flexGrow: 1,
      padding:'1em',
    },
    paper: {
      display:'flex',
      justifyContent:'end',
      padding: theme.spacing(1.8),
      textAlign: 'center',
      color: '#4F4F4F',
      cursor: 'pointer',
      fontSize: '1.2em',
      // lineHeight:'1em',
      fontWeight:'500',
      '&:hover': {
        color:'black',
        backgroundColor: '#e0c1ff',
      },
    },
    helperText:{
      margin: '0 !important',
    },
    tabIconButton:{
      color:'rgba(255, 255, 255, 0.7) !important',
      '&:hover': {
        color:'white !important',
      },
    }
  }));
  
  export default useStyles