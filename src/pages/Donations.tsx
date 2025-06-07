import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface Donation {
  id: string;
  donorName: string;
  amount?: number;
  items: string;
  date: string;
}

const Donations = () => {
  const { isAuthenticated } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newDonation, setNewDonation] = useState({
    donorName: '',
    amount: '',
    items: '',
  });

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/donations');
      if (!response.ok) {
        throw new Error('Failed to fetch donations');
      }
      const data = await response.json();
      setDonations(data);
    } catch (err) {
      setError('Failed to load donations. Please try again later.');
      console.error('Donations fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDonation = async () => {
    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          donorName: newDonation.donorName,
          amount: newDonation.amount ? Number(newDonation.amount) : undefined,
          items: newDonation.items,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add donation');
      }

      setNewDonation({ donorName: '', amount: '', items: '' });
      setOpenDialog(false);
      fetchDonations();
    } catch (err) {
      setError('Failed to add donation. Please try again later.');
      console.error('Add donation error:', err);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Donations
        </Typography>
        {isAuthenticated && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Add Donation
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {donations.length === 0 ? (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="body1" textAlign="center" color="text.secondary">
                    No donations recorded yet.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ) : (
            donations.map((donation) => (
              <Grid item xs={12} sm={6} md={4} key={donation.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {donation.donorName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {new Date(donation.date).toLocaleDateString()}
                    </Typography>
                    {donation.amount && (
                      <Typography variant="body1" color="primary" gutterBottom>
                        Amount: ₹{donation.amount}
                      </Typography>
                    )}
                    <Typography variant="body1">
                      Donated Items: {donation.items}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Donation</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Donor Name"
            fullWidth
            value={newDonation.donorName}
            onChange={(e) =>
              setNewDonation({ ...newDonation, donorName: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Amount (₹)"
            type="number"
            fullWidth
            value={newDonation.amount}
            onChange={(e) =>
              setNewDonation({ ...newDonation, amount: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Donated Items"
            fullWidth
            multiline
            rows={3}
            value={newDonation.items}
            onChange={(e) =>
              setNewDonation({ ...newDonation, items: e.target.value })
            }
            placeholder="e.g., 1 football, water bottles, etc."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddDonation}
            color="primary"
            disabled={!newDonation.donorName || !newDonation.items}
          >
            Add Donation
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Donations; 