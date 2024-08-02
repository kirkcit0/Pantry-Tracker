import { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography } from '@mui/material';

const RecipeRequest = ({ pantry }) => {
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestRecipe = async () => {
    setLoading(true);
    try {
      const items = pantry.map(item => item.name);
      const response = await axios.post('/api/llama', { items });
      setRecipe(response.data.recipe);
    } catch (error) {
      console.error('Error requesting recipe:', error);
      setRecipe('Failed to fetch recipe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Button variant="contained" onClick={handleRequestRecipe} disabled={loading}>
        {loading ? 'Loading...' : 'Get Recipe'}
      </Button>
      {recipe && (
        <Box mt={2}>
          <Typography variant="h6">Recipe:</Typography>
          <Typography>{recipe}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default RecipeRequest;
