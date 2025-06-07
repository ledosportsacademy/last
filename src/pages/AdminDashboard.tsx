import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
  });

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  const handleAddExpense = () => {
    const expense: Expense = {
      id: Date.now().toString(),
      description: newExpense.description,
      amount: Number(newExpense.amount),
      date: new Date().toLocaleDateString(),
    };
    setExpenses([expense, ...expenses]);
    setNewExpense({ description: '', amount: '' });
    setOpenDialog(false);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const quickActions = [
    {
      title: 'Members',
      description: 'Manage academy members',
      path: '/members',
    },
    {
      title: 'Experiences',
      description: 'Manage user experiences',
      path: '/experiences',
    },
    {
      title: 'Donations',
      description: 'View donation records',
      path: '/donations',
    },
    {
      title: 'Analysis',
      description: 'View financial reports',
      path: '/analysis',
    },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3} mb={4}>
        {quickActions.map((action) => (
          <Grid item xs={12} sm={6} md={3} key={action.title}>
            <Card
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate(action.path)}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {action.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Expense Management</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Add Expense
          </Button>
        </Box>

        <Card>
          <List>
            {expenses.map((expense) => (
              <ListItem key={expense.id}>
                <ListItemText
                  primary={expense.description}
                  secondary={`₹${expense.amount} - ${expense.date}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteExpense(expense.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
            {expenses.length === 0 && (
              <ListItem>
                <ListItemText primary="No expenses recorded" />
              </ListItem>
            )}
          </List>
        </Card>
      </Box>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Expense</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            fullWidth
            value={newExpense.description}
            onChange={(e) =>
              setNewExpense({ ...newExpense, description: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Amount (₹)"
            type="number"
            fullWidth
            value={newExpense.amount}
            onChange={(e) =>
              setNewExpense({ ...newExpense, amount: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddExpense}
            color="primary"
            disabled={!newExpense.description || !newExpense.amount}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard; 