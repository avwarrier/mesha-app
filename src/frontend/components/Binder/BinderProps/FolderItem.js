import {React, useState, useEffect, useRef, useCallback} from 'react'
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
import SchoolIcon from '@mui/icons-material/School';
import EditNoteIcon from '@mui/icons-material/EditNote';
import docsLogo from '../../../assets/docsLogo.png'
import NotesIcon from '@mui/icons-material/Notes';
import LinkIcon from '@mui/icons-material/Link';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Dialog from '@mui/material/Dialog';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import CloudIcon from '@mui/icons-material/Cloud';
import {storage} from '../../../../backend/firebase'
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage'
import { v4 as uuid } from 'uuid';
import ReactLoading from "react-loading";

const FolderItem = (props) => {
    const [openAfterEdit, setOpenAfterEdit] = useState(false);

    const [onEdit, setOnEdit] = useState(false);
    const itemInput = useRef(null);
    const [categoryName, setName] = useState('');
    const [prevName, setPrevName] = useState('default');
    const [displayName, setDisplayName] = useState('');

    const reff = useRef(null);
    const { onClickOutside } = props;

    useEffect(() => {
        const handleClickOutside = (event) => {
        if (reff.current && !reff.current.contains(event.target)) {
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

    const [anchorEls, setAnchorEls] = useState(null);
    const opens = Boolean(anchorEls);
    const handleClicks = (event) => {
        setAnchorEls(event.currentTarget);
    };
    const handleCloses = () => {
        setAnchorEls(null);
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
            if(openAfterEdit) props.setOpen(props.id, true);
          setOpenAfterEdit(true);
          setOnEdit(false);
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
        if(openAfterEdit) props.setOpen(props.id, true);
      setOpenAfterEdit(true);
      setOnEdit(false);
    }

    const [openFileDialog, setOpenFileDialog] = useState(false);
    const closeFileDialog = () => {
        setOpenFileDialog(false)
    }

    const [file, setFile] = useState();
    const [file_name, setfile_name] = useState('Select File');
    const [fileLoading, setFileLoading] = useState(false);

    const uploadFile = async(id) => {
        setFileLoading(true);
        if(file == null) return;
        const fileRef = ref(storage, `${props.userEmail}/${id}`)
        await uploadBytes(fileRef, file)
        let fileUrl = await getDownloadURL(fileRef);
        
        return fileUrl;
    }

  return (
    <div ref={reff} style={{'--hover-color': props.selectionColor, '--color': props.dropColor}}  className={onEdit ? 'my-[0px] rounded-lg h-[35px]  flex items-center justify-between px-[10px] ' : 'my-[0px] rounded-lg h-[35px]  flex items-center justify-between px-[10px]  cursor-pointer  hover:!bg-[--hover-color]'}>
        <Dialog onClose={closeFileDialog} open={openFileDialog}>
            <div className='w-[380px] h-[280px] bg-[#f1f1f1] flex flex-col justify-center items-center gap-[20px]'>
                {
                    fileLoading ? 
                    <ReactLoading type="bubbles" color="#4a6a8f" />
                    :
                    <>
                    <label onChange={(event) => {
                    setFile(event.target.files[0]);
                    setfile_name(event.target.files[0].name)
                }}>
            <input type='file' hidden/>
            <div className='w-[300px] h-[150px] rounded-lg border-dashed border-[#72b6e1] cursor-pointer hover:border-[#5593b9] border-[2px] flex flex-col justify-center items-center'>
                <CloudIcon sx={{fontSize: 70, color: "#bfd2de", "&:hover": {
      color: "#b0c6d4"
    }}}/>
                <p className='text-[#49596b]'>{file_name}</p>
            </div>
            </label>
                
                <div onClick={async() => {
                    if(file == null) return;
                    const id = uuid();
                    let myurl = await uploadFile(id);
                    props.addFile(file, id, myurl)
                    setFileLoading(false);
                    
                    setfile_name('Select File');
                    setOpenFileDialog(false);
                    }} className='h-[30px] w-[200px] rounded-sm  bg-[#4a6a8f] cursor-pointer  text-[#fff] shadow-md hover:bg-[#425c7a] items-center justify-center flex font-light'>upload</div></>
                }
            
                
            </div>
        </Dialog>
        <div className='flex items-center'>
            <FolderIcon onClick={() => props.setOpen(props.id, !props.open)} sx={{fontSize: '20px', marginRight: '2px', color: "#6a8099"}}/>
            {
                onEdit ? 
                <input style={{'--color': props.inputColor}} ref={itemInput} onKeyDown={handleKeyDown} value={categoryName} onChange={(e) => {setName(e.target.value)
                    setDisplayName(e.target.value)
                }} className={!untitled ? '!bg-[--color] outline-none border-[1.3px] border-[#000] rounded-sm h-[25px] w-[110px] px-[3px] ml-[1px]' : '!bg-[--color] outline-none border-[1.5px] border-red-500 rounded-sm h-[25px] w-[110px] px-[3px] ml-[1px]'}/>
                :
                <p onClick={() => props.setOpen(props.id, !props.open)} className={!props.open ? ' flex items-center ml-[5px]  select-none' : ' flex items-center  ml-[5px] underline select-none'}>{displayName}</p>
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

            <div style={{'--hover-color': props.selectionColor}} onClick={handleClicks} className='flex justify-center items-center h-[20px] w-[20px] p-[5px] rounded-sm cursor-pointer  hover:!bg-[--hover-color] hover:drop-shadow-lg'>
                <AddIcon sx={{fontSize: "15px"}}/>
            </div>
            <Menu
            elevation={3}
                MenuListProps={{
                    'aria-labelledby': 'fade-button',
                  }}
                anchorEl={anchorEls}
                open={opens}
                onClose={handleCloses}
                onClick={handleCloses}
                TransitionComponent={Fade}
                sx={
                    { "& .MuiMenu-paper": 
                      { backgroundColor: props.inputColor, borderRadius: "10px", width: "140px", paddingX: "5px"}, 
                      
                    }
                  }
            >
                <MenuItem sx={{borderRadius: "5px"}} onClick={() => {
                    props.addItem(20)
                        props.setOpen(props.id, true);
                        returnEdit(false);
                    }} className='flex items-center gap-[10px] h-[30px]'>
                  <CreateNewFolderIcon sx={{color: "#6a8099"}}/>
                  <p className=' font-light'>Folder</p>
                </MenuItem>
                <MenuItem sx={{borderRadius: "5px"}} onClick={() => {
                    props.addItem(30)
                        props.setOpen(props.id, true);
                        returnEdit(false);
                    }}  className='flex items-center gap-[10px] h-[30px]'>
                <EditNoteIcon sx={{color: "#333"}}/>
                  <p className=' font-light'>Notebook</p>
                </MenuItem>
                <MenuItem sx={{borderRadius: "5px"}} onClick={() => {
                    props.addItem(40)
                        props.setOpen(props.id, true);
                        returnEdit(false);
                    }}  className='flex items-center gap-[10px] h-[30px]'>
                <img className='h-[18px] items-center justify-center flex' src={docsLogo}/>
                  <p className=' font-light'>Document</p>
                </MenuItem>
                <MenuItem sx={{borderRadius: "5px"}} onClick={() => {
                    props.addItem(50)
                        props.setOpen(props.id, true);
                        returnEdit(false);
                    }}  className='flex items-center gap-[10px] h-[30px]'>
                <LinkIcon sx={{color: "#c41a0e"}}/>
                  <p className=' font-light'>Link</p>
                </MenuItem>
                <MenuItem sx={{borderRadius: "5px"}} onClick={() => {
                    props.addItem(60)
                        props.setOpen(props.id, true);
                        returnEdit(false);
                    }}  className='flex items-center gap-[10px] h-[30px]'>
                <NotesIcon sx={{color: "#222"}}/>
                  <p className=' font-light'>Note</p>
                </MenuItem>
                <MenuItem sx={{borderRadius: "5px"}} onClick={() => {
                        setOpenFileDialog(true);
                        props.setOpen(props.id, true);
                        returnEdit(false);
                    }}  className='flex items-center gap-[10px] h-[30px]'>
                <CloudDownloadIcon sx={{color: "#3a6391"}}/>
                  <p className=' font-light'>File</p>
                </MenuItem>
                
            </Menu>
        </div>
    </div>
  )
}

export default FolderItem