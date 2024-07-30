"use client"
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material';
import { firestore } from './firebase'
import { collection, query, doc, getDocs, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';

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

export default function Home() {
  const [pantry, setpantry] = useState([])

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [itemName, setItemName] = useState([])

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'));
    const docs = await getDocs(snapshot)
    const pantryList = []
    docs.forEach((doc) => {
      pantryList.push({name: doc.id, ...doc.data()})
    });
    // console.log(pantryList);
    setpantry(pantryList)
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async (item) => {
    const docref = await doc(collection(firestore, 'pantry'), item)

    const docSnap = await getDoc(docref)
    if(docSnap.exists()){
      const {count} = docSnap.data()
      await setDoc(docref, {count: count + 1})
    } else {
      await setDoc(docref, {count: 1})
    }

    await updatePantry()
  }

  const removeItem = async (item) => {
    const docref = await doc(collection(firestore, 'pantry'), item)

    const docSnap = await getDoc(docref)
    if(docSnap.exists()){
      const {count} = docSnap.data()
      if(count === 1){
        await deleteDoc(docref)
      } else {
        await setDoc(docref, {count: count - 1 })
      }
    }

    await updatePantry()
  }

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Item Adder
          </Typography>
          <Stack direction='row' spacing={2}>
            <TextField id="outlined-basic" label="Item" variant="outlined" value={itemName} onChange={(e) => setItemName(e.target.value)}/>
            <Button variant='contained' onClick={() => {
              addItem(itemName.toLowerCase())
              setItemName('')
              handleClose()
            }}>
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}>Add</Button>
      <Box border={'1px solid #333'}>
        <Box width="800px" height="100px" bgcolor={'#ffd700'} display={'flex'} justifyContent="center" alignItems="center" >
          <Typography variant='h2' color='#333' textAlign='center'>
            Pantry Items
          </Typography>
        </Box>
        <Stack width="800px" height="200px" spacing={2} overflow={'auto'}>
          {pantry.map(({name, count}) => (
            <Box
              key={name}
              width="100%"
              height="300px"
              display="flex"
              justifyContent="space-between"
              padding={2}
              alignItems="center"
              bgcolor="#f4f4f4"
            >
              <Typography
                variant='h2'
                color={'#333'}
                textAlign={'center'}
              >
                {
                  name.charAt(0).toUpperCase() + name.slice(1) + ": " + count
                }
              </Typography>
              
              <Button variant='contained' onClick={() => removeItem(name)}>
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
