// components/RecipeRequest.js
import { useState } from 'react';
import axios from 'axios';
import { Box, Button, Typography } from '@mui/material';

// Function to format recipe text
function formatRecipeText(text) {
  let formattedText = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Double asterisks for bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Single asterisks for italic
    .replace(/(\d+\.)\s+/g, '<br/><strong>$1</strong>') // Numbered lists
    .replace(/(\n\n)/g, '<p></p>'); // Paragraphs

  return formattedText;
}

const RecipeRequest = ({ pantry }) => {
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRequestRecipe = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = pantry.map(item => item.name);
      const response = await axios.post('/api/llama', { items });
      const formattedRecipe = formatRecipeText(response.data.recipe);
      setRecipe(formattedRecipe);
    } catch (error) {
      console.error('Error requesting recipe:', error);
      setError('Failed to fetch recipe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Button variant="contained" onClick={handleRequestRecipe} disabled={loading}>
        {loading ? 'Loading...' : 'Get Recipe'}
      </Button>
      {error && (
        <Box mt={2}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}
      {recipe && (
        <Box mt={2}>
          <Typography variant="h6">Recipe:</Typography>
          {/* Use `dangerouslySetInnerHTML` to render formatted HTML */}
          <Typography component="div" dangerouslySetInnerHTML={{ __html: recipe }} />
        </Box>
      )}
    </Box>
  );
};

export default RecipeRequest;
