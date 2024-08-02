"use client";
import { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { firestore } from '../firebase/config';
import { collection, query, doc, getDocs, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import ThemeToggle from '../components/ThemeToggle';
import SearchAndActionBar from '../components/SearchAndActionBar';
import AddItemModal from '../components/AddItemModal';
import PantryList from '../components/PantryList';
import RecipeRequest from '../components/RecipeRequest';
import RateLimitChecker from '../components/RateLimitChecker';

const darkModeStyles = {
    backgroundColor: '#121212', // Dark background
    color: '#ffffff',           // Light text
    borderColor: '#333333',     // Darker borders
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)', // Dark shadow for elements
  };

  const lightModeStyles = {
    backgroundColor: '#ffffff', // Light background
    color: '#000000',           // Dark text
    borderColor: '#cccccc',     // Lighter borders
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Lighter shadow for elements
  };
  

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    updatePantry();
  }, []);

  const updatePantry = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
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
      <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
      <SearchAndActionBar 
        search={search}
        setSearch={setSearch}
        openModal={() => setOpen(true)}
        handleSignOut={handleSignOut}
      />
      <AddItemModal 
        open={open}
        handleClose={() => setOpen(false)}
        itemName={itemName}
        setItemName={setItemName}
        addItem={addItem}
      />
      <RecipeRequest pantry={pantry} />
      <RateLimitChecker />
      {loading ? (
        <CircularProgress />
      ) : (
        <PantryList 
          pantry={pantry}
          search={search}
          removeItem={removeItem}
        />
      )}
    </Box>
  );
}