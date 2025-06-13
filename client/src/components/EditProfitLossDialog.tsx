import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../features/store';
import { updateProfitLossEntry } from '../features/profitLossSlice';
import { ProfitLossEntry } from '../types';

interface EditProfitLossDialogProps {
  open: boolean;
  onClose: () => void;
  entry: ProfitLossEntry;
}

const EditProfitLossDialog: React.FC<EditProfitLossDialogProps> = ({
  open,
  onClose,
  entry,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [status, setStatus] = useState<ProfitLossEntry['status']>(entry.status);
  const [notes, setNotes] = useState(entry.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateProfitLossEntry({
      id: entry.id,
      status,
      notes,
    }));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Entry</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="status"
                label="Status"
                select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProfitLossEntry['status'])}
                fullWidth
                required
              >
                <MenuItem value="Received">Received</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="notes"
                label="Notes"
                multiline
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditProfitLossDialog;
