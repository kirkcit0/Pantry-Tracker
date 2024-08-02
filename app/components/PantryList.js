import { Box, Stack, Typography, Button } from '@mui/material';

const PantryList = ({ pantry, search, removeItem }) => (
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
);

export default PantryList;
