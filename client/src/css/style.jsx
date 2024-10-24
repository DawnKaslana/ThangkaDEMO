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
      whiteSpace: 'nowrap',
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
    flexColCenter: {
      display:"flex",flexDirection:"column", justifyContent:"center", alignItems: 'center'
    },
    flexRow: {
      display:"flex",flexDirection:"row", alignItems: 'center', 
    },
    reactMarkDown: {
      '& p':{
        fontSize: '16px',
        marginBottom: '1em',
        marginTop: '1em',
      } 
    },
  }));
  
  export default useStyles