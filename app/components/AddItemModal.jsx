import { Box, Stack, Typography, TextField, Button, Modal } from '@mui/material';

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

const AddItemModal = ({ open, handleClose, itemName, setItemName, addItem }) => (
  <Modal
    open={open}
    onClose={handleClose}
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
            handleClose();
          }}
        >
          Add
        </Button>
      </Stack>
    </Box>
  </Modal>
);

export default AddItemModal;
