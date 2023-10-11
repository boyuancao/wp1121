import { useEffect, useState } from "react";

import { Button } from "@mui/material";

import CardList from "@/components/CardList";
import HeaderBar from "@/components/HeaderBar";
import NewListDialog from "@/components/NewListDialog";
import useCards from "@/hooks/useCards";
import { TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

function App() {
  const { lists, fetchLists, fetchCards } = useCards();
  const [newListDialogOpen, setNewListDialogOpen] = useState(false);
  const [onDelete, setOnDelete] = useState(false);
  const [isDoneClicked, setIsDoneClicked] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchLists();
    fetchCards();
  }, [fetchCards, fetchLists]);

  const handleAddClick = () => {
    setNewListDialogOpen(true)
    setIsDoneClicked(false);
    setOnDelete(false);
  }

  const handleDeleteClick = () => {
    setIsDoneClicked(prevState => !prevState);
    setOnDelete(prevState => !prevState);
    
  };

  // 篩選符合搜尋條件的卡片清單
  const filteredLists = lists.filter(list =>
    list.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <HeaderBar />
      
      <main className="mt-5 mx-4">
        <Grid container alignItems="center" spacing={9}>
          <Grid item xs={2}>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              My Playlists
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Button 
              variant="contained" 
              className="bg-customGreen text-white"
              onClick={handleAddClick}
            >
              add
            </Button>
          </Grid>
          <Grid item xs={1}>
            <Button 
              variant="contained" 
              color="secondary"
              className="bg-customGreen text-white"
              onClick={handleDeleteClick}
            >
              {isDoneClicked ? 'done' : 'delete'}
            </Button>
          </Grid>
          <Grid item xs={1}>
            
          </Grid>
          <Grid item xs={3}>
            <TextField
              placeholder="搜尋..."
              variant="outlined"
              size="small"
              fullWidth
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Grid>
          
        </Grid>
      </main>
    
      <main className="mx-auto flex max-h-full flex-row gap-6 px-24 py-12">
        {filteredLists.map((list) => (
          <CardList key={list.id} {...list} 
          onDelete={onDelete}/>
        ))}
        
        <NewListDialog
          open={newListDialogOpen}
          onClose={() => setNewListDialogOpen(false)}
        />
      </main>
    </>
  );
}

export default App;
