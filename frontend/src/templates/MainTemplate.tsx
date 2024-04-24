import { Button, Container, CssBaseline, Divider, Drawer, IconButton, Toolbar, Typography } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { FormEvent, useContext, useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { MainPage } from '../pages/monitorReceivers/mainPage';
import { ReceiverListContext } from '../State Management/ReceiverListContext';
import React from 'react';



const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),

  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));



export const MainTemplate = () => {
  const [open, setOpen] = useState(false)
  const [isPinging, setisPinging] = useState<boolean>(false)
  const { receiverList, updateReceiverListState } = useContext(ReceiverListContext) || {};
  const [formState, setFormState] = useState<number[]>([]);

  useEffect(() => {
    const receiverIds = receiverList?.reduce<number[]>((acc, receiver) => {
      if (receiver.isSelected) {
        acc.push(receiver.id);
      }
      return acc;
    }, []);
    console.log("receiverIDs: ", receiverIds)
    setFormState(receiverIds ?? []);
  }, [receiverList]);

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const handleClick = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shouldPing`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "shouldPing": !isPinging })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setisPinging(data["Monitoring devices"]);

      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    console.log("The form state", formState)
    event.preventDefault();

    fetch(`${process.env.REACT_APP_BACKEND_URL}/updateReceiverListState`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "selectedDevices": formState })
    })
      .then((response) => response.json())
      .then((data) => {
        if (updateReceiverListState) {
          updateReceiverListState(data)
        }
        return data;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  return (
    <Box>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
            <Typography padding={1}>Device List</Typography>
          </IconButton>

          {isPinging ?
            <Button hidden={!open} variant='contained' sx={{ paddingX: "5px", bgcolor: "red", fontWeight: "bold", '&:hover': { bgcolor: "black" } }} onClick={handleClick}>Stop Monitoring</Button>
            : <Button hidden={!open} variant='contained' sx={{ bgcolor: "Green", fontWeight: "bold", '&:hover': { bgcolor: "greenyellow", color: "black" } }} onClick={handleClick}>Start Monitoring</Button>
          }

        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Typography variant="h6" >Device List</Typography>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />

        <form onSubmit={handleSubmit}>
          <Box>
            <Button type="submit">Update receivers</Button>
          </Box>

          {receiverList?.map(receiver => (
            <React.Fragment key={receiver.id}>
              <input
                type='checkbox'
                name={receiver.name}
                id={String(receiver.id)}
                checked={formState?.includes(receiver.id) || false}
                onChange={() => {
                  setFormState(prevState => {
                    const updatedState = prevState ? [...prevState] : [];
                    const index = updatedState.indexOf(receiver.id);
                    if (index > -1) {
                      updatedState.splice(index, 1);
                    } else {
                      updatedState.push(receiver.id);
                    }
                    console.log("Main Template:", updatedState)
                    return updatedState;
                  });
                }}
              />
              <label htmlFor={receiver.id.toString()}>{receiver.name}</label>
              <br />
            </React.Fragment>
          ))}

        </form>

      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Container maxWidth="xl">

          <MainPage />

        </Container>
      </Main>
    </Box>
  )
}