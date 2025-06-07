import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface Experience {
  id: string;
  name: string;
  message: string;
  imageUrl?: string;
  date: string;
}

const Experiences: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newExperience, setNewExperience] = useState({
    name: '',
    message: '',
    imageUrl: '',
  });

  const handleAddExperience = () => {
    const experience: Experience = {
      id: Date.now().toString(),
      ...newExperience,
      date: new Date().toLocaleDateString(),
    };
    setExperiences([experience, ...experiences]);
    setNewExperience({ name: '', message: '', imageUrl: '' });
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Member Experiences
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Share Experience
        </Button>
      </Box>

      <Grid container spacing={3}>
        {experiences.map((experience) => (
          <Grid item xs={12} md={6} key={experience.id}>
            <Card>
              {experience.imageUrl && (
                <CardMedia
                  component="img"
                  height="200"
                  image={experience.imageUrl}
                  alt={experience.name}
                />
              )}
              <CardContent>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="h6">{experience.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {experience.date}
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  {experience.message}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Share Your Experience</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Your Name"
            fullWidth
            value={newExperience.name}
            onChange={(e) =>
              setNewExperience({ ...newExperience, name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Your Message"
            fullWidth
            multiline
            rows={4}
            value={newExperience.message}
            onChange={(e) =>
              setNewExperience({ ...newExperience, message: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Image URL (optional)"
            fullWidth
            value={newExperience.imageUrl}
            onChange={(e) =>
              setNewExperience({ ...newExperience, imageUrl: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddExperience}
            color="primary"
            disabled={!newExperience.name || !newExperience.message}
          >
            Share
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Experiences; 