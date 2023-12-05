import { Route, Routes, Link, Navigate } from 'react-router-dom';
import LogoutButton from './Auth/Logout.jsx';
import LoginPage from './Auth/LoginPage.jsx';
// import Feedback from './Feedback/Feedbk.jsx';
import Profile from './Auth/Profile.jsx';
import MapC from './Map/Map.jsx';
import Feedback from './Feedback/Feedback.jsx';
import RoutesTypes from './Book/routesTypes.jsx';
import NavigateMap from './Map/NavigateMap.jsx';
import SignupPage from './Auth/Signup.jsx';
import Booking from './Book/Booking.jsx';
import PlotMap from './Map/PlotMap.jsx';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
  ListItemButton,
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
  // const { isLoading, isAuthenticated, user, getAccessTokenSilently } =
  //   useAuth0();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const authStausLocalStorage = localStorage.getItem('loginstatus');

  useEffect(() => {
    if (authStausLocalStorage === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const authHandler = (status) => {
    setIsAuthenticated(status);
  };

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

  // useEffect(() => {
  //   const t = () => {
  //     if (isAuthenticated) {
  //       console.log(isAuthenticated);
  //       console.log(user);
  //       console.log(JSON.stringify({ name: user.nickname, email: user.email }));
  //       // console.log(
  //       //   getAccessTokenSilently().then((accessToken) => {
  //       //     console.log(accessToken);
  //       //   })
  //       // );
  //     }
  //   };
  //   t();
  // }, [isAuthenticated, user]);

  // if (isLoading) {
  //   return <CircularProgress />;
  // }

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
    <List sx={{ textDecoration: 'none', color: 'inherit' }}>
      <ListItem component={Link} to="/profile">
        <ListItemText primary="Profile" />
      </ListItem>
      {/* <ListItem component={Link} to="/map">
        <ListItemText primary="Map" />
      </ListItem> */}
      <ListItemButton
        component="a"
        href={`${process.env.REACT_APP_SERVER_BE}/city_public_transit_stops`}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ color: 'rgb(85,26,139)' }}
      >
        <ListItemText primary="All Routes" />
      </ListItemButton>
      <ListItem component={Link} to="/navigateMap">
        <ListItemText primary="Navigate Map" />
      </ListItem>
      <ListItem component={Link} to="/plotMap">
        <ListItemText primary="Plot Map" />
      </ListItem>
      <ListItem component={Link} to="/feedback">
        <ListItemText primary="Feedback" />
      </ListItem>
      <ListItem component={Link} to="/book">
        <ListItemText primary="Plan Trip" />
      </ListItem>
      <ListItem component={Link} to="/routeType">
        <ListItemText primary="Route Types" />
      </ListItem>
    </List>
  );

  const menuItems = [
    // { to: '/map', text: 'Map' },
    { to: '/navigateMap', text: 'Navigate Map' },
    { to: '/plotMap', text: 'Plot Map' },
    { to: '/routeType', text: 'Route Type' },
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
          {/* {!isAuthenticated && isSmallScreen && <LoginButton />} */}
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
              <LogoutButton authstate={authHandler} />
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
                <Button color="inherit">
                  <a
                    href={`${process.env.REACT_APP_SERVER_BE}/city_public_transit_stops.html`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    All Routes
                  </a>
                </Button>
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
                  to="/book"
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    marginRight: '5px',
                  }}
                >
                  <Button color="inherit">Plan Trips</Button>
                </Link>
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
                <LogoutButton authstate={authHandler} />
              </>
            ) : null}
          </Box>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route
          path="/signup"
          element={
            isAuthenticated ? <Navigate to="/profile" /> : <SignupPage />
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/profile" />
            ) : (
              <LoginPage authstate={authHandler} />
            )
          }
        />
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <Profile authStatus={authHandler} />
            ) : (
              <Navigate to="/login" />
            )
          }
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
          path="/book"
          element={isAuthenticated ? <Booking /> : <Navigate to="/login" />}
        />
        <Route
          path="/feedback"
          element={isAuthenticated ? <Feedback /> : <Navigate to="/login" />}
        />
        <Route
          path="/routeType"
          element={isAuthenticated ? <RoutesTypes /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;
