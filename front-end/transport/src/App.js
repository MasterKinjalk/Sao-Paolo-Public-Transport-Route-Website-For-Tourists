import { Route, Routes, Link, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './Auth/Login.jsx';
import LogoutButton from './Auth/Logout.jsx';
import LoginPage from './Auth/LoginPage.jsx';
import Profile from './Auth/Profile.jsx';
import MapC from './Map/Map.jsx';
import Feedback from './Feedback/Feedback.jsx';
import NavigateMap from './Map/NavigateMap.jsx';
import PlotMap from './Map/PlotMap.jsx';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Menu,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function App() {
  const { isLoading, isAuthenticated, user, getAccessTokenSilently } =
    useAuth0();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const isSmallScreen = useMediaQuery('(max-width:600px)');

  // useEffect(() => {
  //   const sendToAPI = async () => {
  //     if (isAuthenticated) {
  //       try {
  //         // const accessToken = await getAccessTokenSilently();
  //         const response = await fetch(
  //           'https://cs411-team124-quertyqueries.uc.r.appspot.com/signup',
  //           {
  //             method: 'POST',
  //             headers: {
  //               // Authorization: `Bearer ${accessToken}`,
  //               'Content-Type': 'application/json',
  //             },
  //             body: JSON.stringify({ name: user.nickname, email: user.email }),
  //           }
  //         );
  //         console.log('Sent', response);
  //       } catch (error) {
  //         console.error('Error sending token to backend:', error);
  //       }
  //     }
  //   };

  //   if (isAuthenticated) {
  //     sendToAPI();
  //   }
  // }, [isAuthenticated, user]);

  useEffect(() => {
    const t = () => {
      if (isAuthenticated) {
        console.log(isAuthenticated);
        console.log(user);
        console.log(JSON.stringify({ name: user.nickname, email: user.email }));
        // console.log(
        //   getAccessTokenSilently().then((accessToken) => {
        //     console.log(accessToken);
        //   })
        // );
      }
    };
    t();
  }, [isAuthenticated, user]);

  if (isLoading) {
    return <CircularProgress />;
  }

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerList = (
    <List>
      <ListItem component={Link} to="/profile">
        <ListItemText primary="Profile" />
      </ListItem>
      {/* <ListItem component={Link} to="/map">
        <ListItemText primary="Map" />
      </ListItem> */}
      <ListItem component={Link} to="/navigateMap">
        <ListItemText primary="Navigate Map" />
      </ListItem>
      <ListItem component={Link} to="/plotMap">
        <ListItemText primary="Plot Map" />
      </ListItem>
      <ListItem component={Link} to="/feedback">
        <ListItemText primary="Feedback" />
      </ListItem>
    </List>
  );

  const menuItems = [
    // { to: '/map', text: 'Map' },
    { to: '/navigateMap', text: 'Navigate Map' },
    { to: '/plotMap', text: 'Plot Map' },
  ];

  const renderMenuItems = () => {
    return menuItems.map((item) => (
      <MenuItem key={item.to} onClick={handleClose}>
        <Link to={item.to} style={{ textDecoration: 'none', color: 'inherit' }}>
          {item.text}
        </Link>
      </MenuItem>
    ));
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ margin: 0 }}>
      <AppBar position="static" sx={{ margin: 0 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Transport
          </Typography>
          {/* <LoginButton /> */}
          {!isAuthenticated && isSmallScreen && <LoginButton />}
          {isAuthenticated && isSmallScreen && (
            <Box>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
              >
                {drawerList}
              </Drawer>
              <LogoutButton />
            </Box>
          )}

          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
            }}
          >
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Button color="inherit">Profile</Button>
                </Link>
                {/* <Link
                  to="/map"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Button color="inherit">Map</Button>
                </Link>
                <Link
                  to="/navigateMap"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Button color="inherit">NavigateMap</Button>
                </Link>
                <Link
                  to="/plotMap"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Button color="inherit">PlotMap</Button>
                </Link> */}
                <Box>
                  <Button
                    color="inherit"
                    aria-controls="map-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                    endIcon={<ArrowDropDownIcon sx={{ marginLeft: '-10px' }} />}
                  >
                    Map Options
                  </Button>
                  <Menu
                    id="map-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    {renderMenuItems()}
                  </Menu>
                </Box>
                <Link
                  to="/feedback"
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    marginRight: '5px',
                  }}
                >
                  <Button color="inherit">Feedback</Button>
                </Link>
                <LogoutButton />
              </>
            ) : (
              <LoginButton />
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/profile" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/map"
          element={isAuthenticated ? <MapC /> : <Navigate to="/login" />}
        />
        <Route
          path="/navigateMap"
          element={isAuthenticated ? <NavigateMap /> : <Navigate to="/login" />}
        />
        <Route
          path="/plotMap"
          element={isAuthenticated ? <PlotMap /> : <Navigate to="/login" />}
        />
        <Route
          path="/feedback"
          element={isAuthenticated ? <Feedback /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;
