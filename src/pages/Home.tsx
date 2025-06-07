import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  People,
  Comment,
  Favorite,
  Assessment,
} from '@mui/icons-material';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Members',
      description: 'View and manage academy members',
      icon: <People fontSize="large" color="primary" />,
      path: '/members',
    },
    {
      title: 'Experiences',
      description: 'Share and read member experiences',
      icon: <Comment fontSize="large" color="primary" />,
      path: '/experiences',
    },
    {
      title: 'Donations',
      description: 'Support our academy',
      icon: <Favorite fontSize="large" color="primary" />,
      path: '/donations',
    },
    {
      title: 'Analysis',
      description: 'View academy statistics',
      icon: <Assessment fontSize="large" color="primary" />,
      path: '/analysis',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to LEDO SPORTS ACADEMY
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          Nurturing talent, building champions
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {features.map((feature) => (
          <Grid item xs={12} sm={6} md={3} key={feature.title}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box mb={2}>{feature.icon}</Box>
                <Typography gutterBottom variant="h5" component="h2">
                  {feature.title}
                </Typography>
                <Typography color="textSecondary">
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  onClick={() => navigate(feature.path)}
                >
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home; 