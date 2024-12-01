import React from 'react';
import Drawer from '@mui/material/Drawer';
import { styled, useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import JobForm from './JobForm';
import AppTheme from './theme/AppTheme';
import Space from './Space.js';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import HomeIcon from '@mui/icons-material/Home';
import InsightsIcon from '@mui/icons-material/Insights';
import WorkIcon from '@mui/icons-material/Work';
import ListItemText from '@mui/material/ListItemText';
import { JobsProvider } from './JobsContext';


const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

function CustomListItem(props) {
  return (
    <ListItem key={props.key_name} disablePadding>
      <ListItemButton
        onClick={() => {
          props.setCurrentView(props.key_name);
        }}
      >
        <ListItemIcon>
          {props.icon}
        </ListItemIcon>
        <ListItemText primary={props.text} />
      </ListItemButton>
    </ListItem>
  );
}



function App(props) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [currentView, setCurrentView] = React.useState('Setup');

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };


  return (
    <JobsProvider>
      <AppTheme {...props}>
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={[
                {
                  mr: 2,
                },
                open && { display: 'none' },
              ]}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Skills Finder
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer
          open={open}
          variant="persistent"
          anchor="left"
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            <CustomListItem key_name='Setup' text='Setup' icon={<HomeIcon />} setCurrentView={setCurrentView} />
            <CustomListItem key_name='Jobs' text='Jobs' icon={<WorkIcon />} setCurrentView={setCurrentView} />
            <CustomListItem key_name='Skills' text='Skills' icon={<InsightsIcon />} setCurrentView={setCurrentView} />
          </List>
        </Drawer>

        <div className="App">
          <Space>
            {currentView === 'Setup' && <Box>Setup</Box>}
            {currentView === 'Jobs' && <JobForm />}
            {currentView === 'Skills' && <Box>Skills</Box>}
          </Space>
        </div>
      </AppTheme>
    </JobsProvider>
  );
}

export default App;
