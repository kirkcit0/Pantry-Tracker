import { Box, Stack, Typography } from '@mui/material';

const item = [
  'tomato',
  'potato',
  'apple',
  'toothpaste',
  'joe',
  'onion',
  'garlic'
];

export default function Home() {
  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" >
      <Box border={'1px solid #333'}>
        <Box width="800px" height="100px" bgcolor={'#ffd700'} display={'flex'} justifyContent="center" alignItems="center" >
          <Typography variant='h2' color='#333' textAlign='center'>
            Pantry Items
          </Typography>
        </Box>
        <Stack width="800px" height="200px" spacing={2} overflow={'auto'}>
          {item.map((i) => (
            <Box
              key={i}
              width="100%"
              height="300px"
              display="flex"
              justifyContent="center"
              alignItems="center"
              bgcolor="#f4f4f4"
            >
              <Typography
                variant='h2'
                color={'#333'}
                textAlign={'center'}
              >
                {
                  i.charAt(0).toUpperCase() + i.slice(1)
                }
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
