// pages/auth/error.tsx
import { Container, Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';

const ErrorPage: React.FC = () => {
  const router = useRouter();
  const { error } = router.query;

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Authentication Error
        </Typography>
        <Typography color="error" gutterBottom>
          {error || 'An error occurred during authentication.'}
        </Typography>
        <Button variant="contained" color="primary" onClick={() => router.push('/auth/signin')}>
          Go Back to Sign In
        </Button>
      </Box>
    </Container>
  );
};

export default ErrorPage;
