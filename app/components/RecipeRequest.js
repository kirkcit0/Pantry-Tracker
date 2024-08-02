import { useState } from 'react';
import axios from 'axios';
import { Box, Button, Typography, CircularProgress } from '@mui/material';

// Function to format recipe text
function formatRecipeText(text) {
  let formattedText = text
    .replace(/^## (.*?)$/gm, '<h2>$1</h2>') // Markdown-style headers
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
      const response = await axios.post('/api/gemini', { items });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      const formattedRecipe = formatRecipeText(response.data.recipe);
      setRecipe(formattedRecipe);
    } catch (error) {
      console.error('Error requesting recipe:', error);
      setError('Failed to generate recipe, please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display='flex' flexDirection='column' alignItems='center' p={2}>
      <Button 
        variant="contained" 
        onClick={handleRequestRecipe} 
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Generate Recipe'}
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
