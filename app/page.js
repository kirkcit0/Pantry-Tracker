"use client";
import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField, IconButton } from '@mui/material';
import { firestore } from './firebase/config';
import { collection, query, doc, getDocs, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import SearchIcon from '@mui/icons-material/Search';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const darkModeStyles = {
  backgroundColor: '#121212',
  color: '#ffffff',
};

const lightModeStyles = {
  backgroundColor: '#ffffff',
  color: '#000000',
};

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    updatePantry();
  }, []);

  const updatePantry = async () => {
    try {
      const snapshot = query(collection(firestore, 'pantry'));
      const docs = await getDocs(snapshot);
      const pantryList = [];
      docs.forEach((doc) => {
        pantryList.push({ name: doc.id, ...doc.data() });
      });
      setPantry(pantryList);
    } catch (error) {
      console.error("Error fetching pantry items: ", error);
    }
  };

  const addItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'pantry'), item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { count } = docSnap.data();
        await setDoc(docRef, { count: count + 1 });
      } else {
        await setDoc(docRef, { count: 1 });
      }
      await updatePantry();
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  };

  const removeItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'pantry'), item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { count } = docSnap.data();
        if (count === 1) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { count: count - 1 });
        }
        await updatePantry();
      }
    } catch (error) {
      console.error("Error removing item: ", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 2,
        ...(darkMode ? darkModeStyles : lightModeStyles),
      }}
    >
      <Button variant="outlined" onClick={toggleTheme} sx={{ mb: 2 }}>
        Toggle Dark Mode
      </Button>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search items"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mr: 1 }}
        />
        <IconButton onClick={() => setSearch(search.trim())}>
          <SearchIcon />
        </IconButton>
        <Button variant="contained" onClick={() => setOpen(true)} sx={{ ml: 2 }}>
          Add Item
        </Button>
        <Button variant="contained" color="secondary" onClick={handleSignOut} sx={{ ml: 2 }}>
          Sign Out
        </Button>
      </Box>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack direction='row' spacing={2} sx={{ mt: 2 }}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant='contained'
              onClick={() => {
                addItem(itemName.toLowerCase());
                setItemName('');
                setOpen(false);
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box border={'1px solid #333'} sx={{ mt: 2, width: '100%', maxWidth: '800px' }}>
        <Box
          bgcolor={'primary.main'}
          color={'background.paper'}
          display={'flex'}
          justifyContent="center"
          alignItems="center"
          sx={{ height: '100px', mb: 2 }}
        >
          <Typography variant='h2' textAlign='center'>
            Pantry Items
          </Typography>
        </Box>
        <Stack spacing={2} sx={{ maxHeight: '400px', overflowY: 'auto' }}>
          {pantry
            .filter(({ name }) => name.toLowerCase().includes(search.toLowerCase()))
            .map(({ name, count }) => (
              <Box
                key={name}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bgcolor="background.paper"
                p={2}
                borderRadius={2}
                boxShadow={1}
              >
                <Typography variant='h6'>
                  {name.charAt(0).toUpperCase() + name.slice(1) + ": " + count}
                </Typography>
                <Button variant='contained' color='error' onClick={() => removeItem(name)}>
                  Remove
                </Button>
              </Box>
            ))}
        </Stack>
      </Box>
    </Box>
  );
}
