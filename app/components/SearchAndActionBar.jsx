import { Box, TextField, IconButton, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchAndActionBar = ({ search, setSearch, openModal, handleSignOut }) => (
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
    <Button variant="contained" onClick={openModal} sx={{ ml: 2 }}>
      Add Item
    </Button>
    <Button variant="contained" color="secondary" onClick={handleSignOut} sx={{ ml: 2 }}>
      Sign Out
    </Button>
  </Box>
);

export default SearchAndActionBar;
