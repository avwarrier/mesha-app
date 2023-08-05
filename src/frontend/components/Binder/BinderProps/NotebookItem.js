import {React, useState, useEffect, useRef} from 'react'
import FolderIcon from '@mui/icons-material/Folder';
import AddIcon from '@mui/icons-material/Add';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import SubjectIcon from '@mui/icons-material/Subject';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import NotesIcon from '@mui/icons-material/Notes';

const NotebookItem = (props) => {

    const [openAfterEdit, setOpenAfterEdit] = useState(false);

    const [onEdit, setOnEdit] = useState(false);
    const itemInput = useRef(null);
    const [categoryName, setName] = useState('');
    const [prevName, setPrevName] = useState('default');
    const [displayName, setDisplayName] = useState('');

    const ref = useRef(null);
    const { onClickOutside } = props;

    useEffect(() => {
        const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            onClickOutside && onClickOutside();
            if(onEdit) {
                if(categoryName != '') {
                    setOnEdit(false);
                } else {
                props.removeItem(props.id);
                console.log('done');
                }
            }
        }
        };
        document.addEventListener('click', handleClickOutside, true);
        return () => {
        document.removeEventListener('click', handleClickOutside, true);
        };
    }, [ onClickOutside, onEdit ]);

    useEffect(() => {
        
            if (itemInput.current) {
            itemInput.current.focus();
            itemInput.current.select();
        }
    }, [onEdit]);

    useEffect(() => {
        setPrevName(props.name);
        if(props.name == 'default') { 
            setOnEdit(true);
        } else {
            setOnEdit(false);
            setName(props.name);
            if(props.name.length >= 14) {
                setDisplayName(props.name.substring(0, 11) + '...');
            } else {
                setDisplayName(props.name);
            }
        }
    }, [props.name]);

    

    const [anchorEl, setAnchorEl] = useState(null);
    const opener = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [untitled, setUntitled] = useState(false);

    const handleKeyDown = event => {
        console.log('User pressed: ', event.key);
    
        if (event.key === 'Enter') {

            if(categoryName.length >= 14) {
                setDisplayName(categoryName.substring(0, 11) + '...');
            } else if(categoryName == '') {
                setUntitled(true);
                return;
            } else {
                setDisplayName(categoryName);
            }
            props.setName(props.id, '', categoryName);
            setPrevName(categoryName);
          setOnEdit(false);
          if(openAfterEdit) props.setOpen(props.id, true);
          setOpenAfterEdit(true);
        }
    };

    

    const returnEdit = () => {
        if(categoryName.length >= 14) {
            setDisplayName(categoryName.substring(0, 11) + '...');
        } else if(categoryName == '') {
            setUntitled(true);
                return;
        }
        props.setName(props.id, '', categoryName);
        setPrevName(categoryName);
      setOnEdit(false);
      if(openAfterEdit) props.setOpen(props.id, true);
      setOpenAfterEdit(true);
    }

  return (
    <div ref={ref} style={{'--hover-color': props.selectionColor, '--color': props.dropColor}}  className={onEdit ? 'my-[0px] rounded-lg h-[35px] flex items-center justify-between p-[10px] ' : 'my-[0px] rounded-lg h-[35px] flex items-center justify-between p-[10px]  cursor-pointer  hover:!bg-[--hover-color]'}>
        <div className='flex items-center'>
            <EditNoteIcon onClick={() => props.setOpen(props.id, !props.open)} sx={{fontSize: '20px', marginRight: '2px', color: "#333"}}/>
            {
                onEdit ? 
                <input style={{'--color': props.inputColor}} ref={itemInput} onKeyDown={handleKeyDown} value={categoryName} onChange={(e) => {setName(e.target.value)
                    setDisplayName(e.target.value)
                }} className={!untitled ? '!bg-[--color] outline-none border-[1.3px] border-[#000] rounded-sm h-[25px] w-[110px] px-[3px] ml-[1px]' : '!bg-[--color] outline-none border-[1.5px] border-red-500 rounded-sm h-[25px] w-[110px] px-[3px] ml-[1px]'}/>
                :
                <p onClick={() => props.setOpen(props.id, !props.open)} className={!props.open ? ' flex items-center ml-[5px]  select-none' : ' flex items-center ml-[5px] underline select-none'}>{displayName}</p>
            }
        </div>
        <div className='gap-[0px] flex justify-center items-center'>
            
                <div style={{'--hover-color': props.selectionColor}} onClick={handleClick} className='flex justify-center items-center h-[20px] w-[20px] p-[5px] rounded-sm cursor-pointer  hover:!bg-[--hover-color] hover:drop-shadow-lg'>
                    <MoreVertIcon sx={{fontSize: "15px"}} />
                </div>
            
                <Menu
                elevation={3}
                MenuListProps={{
                    'aria-labelledby': 'fade-button',
                  }}
                anchorEl={anchorEl}
                open={opener}
                onClose={handleClose}
                onClick={handleClose}
                TransitionComponent={Fade}
                sx={
                    { "& .MuiMenu-paper": 
                      { backgroundColor: props.inputColor, borderRadius: "10px", width: "110px", paddingX: "5px"}, 
                      
                    }
                  }
            >
                <MenuItem sx={{borderRadius: "5px",}} onClick={() => {
                    props.setOpen(props.id, false);
                    setOnEdit(true)
                    }} className='flex items-center gap-[10px] h-[30px]'>
                  <EditSharpIcon sx={{fontSize: '20x'}}/>
                  <p className=' font-light'>edit</p>
                </MenuItem>
                <MenuItem sx={{borderRadius: "5px",}} onClick={() => props.removeItem(props.id)} className='flex items-center gap-[10px] h-[30px]'>
                  <DeleteIcon sx={{fontSize: '20px'}}/>
                  <p className=' font-light'>delete</p>
                </MenuItem>
                
            </Menu>

            <div style={{'--hover-color': props.selectionColor}} className='flex justify-center items-center h-[20px] w-[20px] p-[5px] rounded-sm cursor-pointer  hover:!bg-[--hover-color] hover:drop-shadow-lg'>
                <AddIcon onClick={() => {
                    props.addItem();
                    props.setOpen(props.id, true);
                    returnEdit();
                }} sx={{fontSize: "15px"}}/>
            </div>
        </div>
    </div>
  )
}

export default NotebookItem