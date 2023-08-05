import {React, useEffect, useState, useRef} from 'react'
import LinkIcon from '@mui/icons-material/Link';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddLinkOutlinedIcon from '@mui/icons-material/AddLinkOutlined';

const LinkAdd = (props) => {
 
    const [link, setLink] = useState('');
    const [displayLink, setDisplayLink] = useState('');
    const [edit, setEdit] = useState(false);
    const ref = useRef(null);
    const itemInput = useRef(null);

    

    useEffect(() => {
        console.log(edit)
            if (itemInput.current) {
            itemInput.current.focus();
        }
    }, [edit]);

    useEffect(() => {
        if(props.link.name == 'default') {
            console.log(props.link.name)
            setDisplayLink('');
            setLink('')
            setEdit(true);
            return;
        }

        setLink(props.link.name);
        
        
        if(props.link.name.length >= 37) {
            setDisplayLink(props.link.name.substring(0, 34) + '...');
            
        } else {
            setDisplayLink(props.link.name);
        }
    }, [props.link])

    const onEnter = event => {
    
        if (event.key === 'Enter') {

            if(link.length >= 36) {
                setDisplayLink(link.substring(0, 33) + '...');
            } else if(link == '') {
                setEdit(true);
                return;
            } else {
                setDisplayLink(link);
            }
            props.addLink(props.id, link);
            setEdit(false);
        }
    }

    

  return (
    <div ref={ref} className={edit ? 'bg-[#ffffff] w-[420px] h-[33px] flex items-center rounded-2xl px-[15px]  hover:border-b-2' : 'w-[420px] h-[33px] flex items-center rounded-2xl px-[15px]  hover:border-b-2'}>
        {edit ? <AddLinkOutlinedIcon  sx={{fontSize: '22px', marginRight: "10px", color: "#3a4754"}}/> : <LinkIcon  sx={{fontSize: '22px', marginRight: "10px", color: "#3a4754"}}/>}
        {edit ? 
            <input ref={itemInput} className='outline-none px-[5px] h-[25px] w-[100%] bg-[#ffffff] placeholder:text-[#6d6b69] placeholder:font-light border-b-[1.5px] border-[#4a6a8f]' onKeyDown={onEnter} value={link} onChange={(e) => {
                setLink(e.target.value);
                setDisplayLink(e.target.value)
            }} placeholder='add link'/>
        :
            <a href={link} target='_blank' className='px-[5px] h-[25px] w-[380px] text-[#4a6a8f] underline cursor-pointer'>{displayLink}</a>
        }
        {!edit &&
            <div onClick={() => props.deleteLink(props.link.id)} className=' hover:bg-[#dadada] hover:drop-shadow-lg items-center justify-center flex cursor-pointer p-[2px] rounded-md ml-[20px]'>
                <DeleteOutlinedIcon sx={{fontSize: "20px", color: "#3a4754"}}/>
            </div>
        }
    </div>
  )
}

export default LinkAdd