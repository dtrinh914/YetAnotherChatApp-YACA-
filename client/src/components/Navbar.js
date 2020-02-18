import React, {useContext, useRef, useState, useEffect} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import IconButton from '@material-ui/core/IconButton';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import GroupIcon from '@material-ui/icons/Group';
import MenuIcon from '@material-ui/icons/Menu';
import SettingsIcon from '@material-ui/icons/Settings';
import EditAttributesIcon from '@material-ui/icons/EditAttributes';
import {makeStyles} from '@material-ui/styles';
import axios from 'axios';
import {ChatContext} from '../contexts/chatContext';
import {NavContext} from '../contexts/navContext';

const useStyles=makeStyles({
    nav:{
        height: '40px',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 100
    },
    tool:{
        display: 'flex',
        justifyContent: 'space-between'
    },
    rightmenu:{
        position:'relative',
        left: '5px',
        background:'#424242',
        color: 'white'
    }
});

function Navbar({history, setLoggedIn, isCreator, isAdmin}){
    const {chatData} = useContext(ChatContext);
    const {navData, navDispatch} = useContext(NavContext);
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    const handleToggle = () => {
        setOpen(prevOpen => !prevOpen);
    };
    
    const handleClose = event => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };
    
    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);

    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    const handleLogOut = () => {
        axios.get('/api/actions/logout', {withCredentials:true})
        .then(res => {
            if(res.data.loggedIn === false){
                setLoggedIn(res.data);
                history.push('/');
            }
        })
        .catch((err) => console.log(err));
    }
    const handleAddMem = () => {
        navDispatch({type:'ADDMEM', open:true});
    }
    const handleLeftDrawer = () => {
        navDispatch({type:'LEFTDRAWER', open:true})
    }

    const handleRightDrawer = () => {
        navDispatch({type:'RIGHTDRAWER', open:true});
    }
    
    const handleToggleInfo = () => {
        navDispatch({type:'RIGHT', open:!navData.rightNav.root});
    }

    const handleGroupSettings = () => {
        navDispatch({type:'GROUPSETTINGS', open:true});
    }
    
    const creatorButtons = <IconButton size='small' onClick={handleGroupSettings}>
                                <EditAttributesIcon />
                           </IconButton>;

    const creatorMenuItems = <MenuItem data-testid='nav-config-groupsettings'
                                onClick={e => {handleClose(e); handleGroupSettings(e);}}>Group Settings</MenuItem>

    return(
        <AppBar position="static" className={classes.nav}>
            <Toolbar className={classes.tool}>
                <Hidden smUp>
                    <IconButton data-testid='nav-group-nav' onClick={handleLeftDrawer} size='small'>
                        <MenuIcon />
                    </IconButton>
                </Hidden>

                <Typography data-testid='nav-group-name'>{chatData.selected.name}</Typography>

                <Hidden mdUp>
                    <IconButton data-testid='nav-config' ref={anchorRef} aria-controls={open ? 'menu-list-grow': undefined} 
                    aria-haspopup='true' onClick={handleToggle} size='small'>
                        <SettingsIcon />
                    </IconButton>

                    <Popper anchorEl={anchorRef.current} open={open} role={undefined} transition disablePortal>
                        {({ TransitionProps, placement }) => (
                            <Grow
                            {...TransitionProps}
                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                            >
                            <Paper className={classes.rightmenu}>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                        <MenuItem data-testid='nav-config-group-info' 
                                            onClick={e => {handleClose(e); handleRightDrawer(e)}}>
                                                Group Information
                                        </MenuItem>
                                        <MenuItem data-testid='nav-config-addmem' 
                                            onClick={e => {handleClose(e); handleAddMem(e);}}>Invite</MenuItem>
                                        {isCreator ? creatorMenuItems : ''}
                                        <MenuItem onClick={e=> {handleClose(e); handleLogOut(e);}}>Logout</MenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                            </Grow>
                        )}
                    </Popper>
                </Hidden>


                <Hidden smDown>
                    <div>
                        <IconButton data-testid='nav-toggle-right' onClick={handleToggleInfo} size='small'>
                            <GroupIcon />
                        </IconButton>
                        <IconButton data-testid='nav-addmem' onClick={handleAddMem} size='small'>
                            <PersonAddIcon />
                         </IconButton>
                        {isCreator ? creatorButtons : ''}
                        <Button onClick={handleLogOut}>Log Out</Button>
                    </div>
                </Hidden>

            </Toolbar>
        </AppBar>
    )
}
export default Navbar;