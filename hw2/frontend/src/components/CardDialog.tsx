import { useState } from "react";

import { Delete as DeleteIcon } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";


import useCards from "@/hooks/useCards";
import { createCard, deleteCard, updateCard, updateList } from "@/utils/client";


export type CardProps = {
  id: string;
  song: string;
  singer: string;
  link: string;
  listId: string;
};


// this pattern is called discriminated type unions
// you can read more about it here: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions
// or see it in action: https://www.typescriptlang.org/play#example/discriminate-types
type NewCardDialogProps = {
  variant: "new";
  open: boolean;
  onClose: () => void;
  listId: string;
  name: string;
  count: number;
  description: string;
  img: string;
  cards: CardProps[];
};

type EditCardDialogProps = {
  variant: "edit";
  open: boolean;
  onClose: () => void;
  listId: string;
  name: string;
  count: number;
  description: string;
  img: string;
  cards: CardProps[];
  cardId: string;
  song: string;
  singer: string;
  link: string;
};

type CardDialogProps = NewCardDialogProps | EditCardDialogProps;

export default function CardDialog(props: CardDialogProps) {
  const { variant, open, onClose, listId, name, count, description, img, cards} = props;
  const song = variant === "edit" ? props.song : "";
  const singer = variant === "edit" ? props.singer : "";
  const link = variant === "edit" ? props.link : "";

  const [newSong, setNewSong] = useState(song);
  const [newSinger, setNewSinger] = useState(singer);
  const [newLink, setNewLink] = useState(link);
  const [localCount, setLocalCount] = useState(count);
  const [onDelete, setOnDelete] = useState(false);
  const [onAdd, setOnAdd] = useState(false);
  const [isDoneClicked, setIsDoneClicked] = useState(false);
  const { fetchCards, fetchLists } = useCards();

  const updateCount = (localCount: number) => {
    try{
      updateList(listId, {
        name: name,
        description: description,
        img: img,
        count:localCount
      });
      fetchLists();
      
    }catch (error) {
      alert("Error: Failed to save list");
    }
    
  } 
  

  const handleSave = (cards : CardProps[]) => {
    // 更新特定行的內容
    let have_duplicate = false;

    cards.map( (card) => {
      if(card.song === newSong){
        alert("歌曲不可重複")
        have_duplicate = true;
        return;
      }
      if(card.singer === newSinger){
        alert("歌手不可重複")
        have_duplicate = true;
        return;
      }
      if(card.link === newLink){
        alert("連結不可重複")
        have_duplicate = true;
        return;
      }
    })

    if(have_duplicate){
      alert("請重新輸入")
      return;
    }
    
    try {
      setLocalCount(prevCount => prevCount + 1)
      updateCount(localCount);
      if (variant === "new") {
        createCard({
          song: newSong,
          singer: newSinger,
          link: newLink,
          list_id: listId,
        });
      } else {
        if (
          newSong === song &&
          newSinger === singer &&
          newLink === link 
        ) {
          return;
        }
        
        

        // typescript is smart enough to know that if variant is not "new", then it must be "edit"
        // therefore props.cardId is a valid value
        updateCard(props.cardId, {
          song: newSong,
          singer: newSinger,
          link: newLink,
          list_id: listId,
        });
      }
      
      fetchCards();
    } catch (error) {
      alert("Error: Failed to save card");
    } finally {
      handleClose();
      window.location.reload()
    }
  };

  const handleDelete = async (card_id : string) => {
    try {
      await deleteCard(card_id);
      fetchCards();
    } catch (error) {
      alert("Error: Failed to delete list");
    }
  };
  
  const handleDeleteClick = () => {
    setIsDoneClicked(prevState => !prevState);
    setOnDelete(prevState => !prevState);
  };

  const handleAddClick = () => {
    setOnAdd(prevState => !prevState);
  };


  const handleClose = () => {
    onClose();
    
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <AppBar position="static">
        <Toolbar>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            WP Music
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogTitle className="flex gap-4">
      <div className="flex">
      {/* 左上角圖片 */}
      <img src={"https://picsum.photos/id/1/200/300"} alt="Image" className="w-32 h-32 object-cover" />

      {/* 右邊標題和敘述 */}
      <div className="ml-4">
        <Typography variant="h4" className="mb-2">{name}</Typography>
        <Typography variant="body1" className="text-lg">{description}</Typography>
      </div>

    </div>

      
      
        

      </DialogTitle>
      <DialogContent className="w-[600px]">
        {/* Add 和 Delete 按鈕 */}
      <div className="flex items-center ml-auto">
        <Button variant="contained" color="primary" className="mr-2" onClick={handleAddClick}>
          Add
        </Button>
        <Button variant="contained" color="secondary"  onClick={handleDeleteClick}>
          {isDoneClicked ? 'done' : 'delete'}
        </Button>
      </div>
          {/* 表格 */}
      <div className="mt-2">
        <table className="border">
          <thead>
            <tr>
              
              {onDelete && (
                
                <th className="border" style={{ width: '2%' }}/>
              )}
              
              <th className="border" style={{ width: '10%' }}>Song</th>
              <th className="border" style={{ width: '10%' }}>Singer</th>
              <th className="border" style={{ width: '10%' }}>Link</th>
            </tr>
          </thead>
          
          <tbody>
            {cards.map(card => (
                
                <tr key={card.id}>
                  {onDelete && (
                    <td className="border" style={{ width: '2%' }}>
                      <div className="grid place-items-center">
                        <IconButton color="error" onClick={() => handleDelete(card.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </td>
                  )}
                  <td className="border" style={{ width: '10%' }}>
                    {card.song}
                  </td>
                  <td className="border" style={{ width: '10%' }}>
                    {card.singer}
                  </td>
                  <td className="border" style={{ width: '10%' }}> 
                    <a href={card.link} target="_blank" rel="noopener noreferrer">
                      {card.link}
                    </a>
                  </td>
                </tr>
          ))}
          {onAdd && (
          <tr>
              <td className="border" style={{ width: '10%' }}>
                <TextField
                  onChange={e => setNewSong(e.target.value)}
                />
              </td>
              <td className="border" style={{ width: '10%' }}>
                <TextField
                  onChange={e => setNewSinger(e.target.value)}
                />
              </td>
              <td className="border" style={{ width: '10%' }}>
                <TextField
                  onChange={e => setNewLink(e.target.value)}
                />
              </td>
          </tr>
          )}
          </tbody>
        </table>
      </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleSave(cards)}>save</Button>
        <Button onClick={handleClose}>close</Button>
      </DialogActions>
    </Dialog>
  );
}
