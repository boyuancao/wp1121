import { useState } from "react";


import DeleteIcon from "@mui/icons-material/Delete";

import IconButton from "@mui/material/IconButton";
import { Typography } from '@mui/material';


import useCards from "@/hooks/useCards";
import { deleteList } from "@/utils/client";

export type CardProps = {
  id: string;
  song: string;
  singer: string;
  link: string;
  listId: string;
};

import CardDialog from "./CardDialog";

export type CardListProps = {
  id: string;
  name: string;
  count: number;
  description: string;
  img: string;
  cards: CardProps[];

};

export type OnDeleteProps = {
  id: string;
  name: string;
  count: number;
  description: string;
  img: string;
  cards: CardProps[];
  onDelete: boolean;
};


export default function CardList({ id, name, count, description, img, cards, onDelete}: OnDeleteProps) {
  const [openNewCardDialog, setOpenNewCardDialog] = useState(false);

  const { fetchLists } = useCards();

  


  
  const handleDelete = async () => {
    try {
      await deleteList(id);
      fetchLists();
    } catch (error) {
      alert("Error: Failed to delete list");
    }
  };

  return (
    <>
      {/* <Paper className="w-80 p-6"> */}
        
        <div className="flex gap-4">
          <div className="flex flex-col gap-4">
              <button
                onClick={() => setOpenNewCardDialog(true)}
                className="w-full rounded-md p-2 hover:bg-white/10"
              >
                <img
                  src="https://picsum.photos/id/1/200/300"
                  alt="Photo"
                  className="photo"
                  style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div className="flex flex-col items-start gap-0.01">
                  <Typography variant="body1" sx={{ color: 'green' }}>
                    {cards.length} songs
                  </Typography>
                  <Typography variant="body1">
                    {name}
                  </Typography>
                </div>
                
              </button> 
            </div>
          
        </div>
        

        {/* 刪除鍵 */}
        {onDelete && (
          <div className="grid place-items-center">
            <IconButton color="error" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </div>
        )}
        {/* <Divider variant="middle" sx={{ mt: 1, mb: 2 }} />
        <div className="flex flex-col gap-4">
          {cards.map((card) => (
            <Card key={card.id} {...card} />
          ))}
          <Button
            variant="contained"
            onClick={() => setOpenNewCardDialog(true)}
          >
            <AddIcon className="mr-2" />
            Add a card
          </Button>
        </div> */}
      {/* </Paper> */}
      
      <CardDialog
        variant="new"
        open={openNewCardDialog}
        onClose={() => setOpenNewCardDialog(false)}
        listId={id}
        name={name}
        count={count}
        description={description}
        img={img}
        cards={cards}
      />
    </>
  );
}
