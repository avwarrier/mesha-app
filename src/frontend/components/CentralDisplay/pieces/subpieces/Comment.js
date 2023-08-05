import React, { useEffect, useState, useRef } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import autosize from 'autosize';

const Comment = (props) => {

    const [onEdit, setEdit] = useState(true);
    const [desc, setDesc] = useState('');
    const [displayComment, setDisplayComment] = useState('');
    const itemInput = useRef(null);
    const [showInfo, setShowInfo] = useState(false);

    

    useEffect(() => {
            if (itemInput.current) {
            itemInput.current.focus();
        }
    }, [onEdit]);

    useEffect(() => {
        console.log("running")
        console.log("h" + props.comment.name)
        if(props.comment.name == 'default') {
            setDesc('');
            setDisplayComment('')
            console.log('truedat')
            setEdit(true);
        } else {
            setDesc(props.comment.name);
            setDisplayComment(props.comment.name)
            setEdit(false)
        }
    }, [props.comment])

    const onEnter = (event) => {
        if (event.key === 'Enter') {

            if(desc == '') {
                setEdit(true);
                return;
            } else {
                setDisplayComment(desc);
            }
            props.setComment(props.id, desc);
            setEdit(false);
        }
    }

    const handleFocus = (e) => {
        const target = e.target;
        
        target.selectionStart = desc.length;
        target.selectionEnd = desc.length;
        autosize(target);
      }

  return (
    <div onMouseLeave={() => setShowInfo(false)} onMouseEnter={() => setShowInfo(true)} className='w-[95%] m-auto bg-[#ffffff] shadow-md rounded-md flex flex-col justify-between mb-[10px]'>
        {
            onEdit ? 
                <textarea onFocus={handleFocus} ref={itemInput} value={desc} onChange={(e) => {
                    setDesc(e.target.value);
                    setDisplayComment(e.target.value)
                }} onKeyDown={onEnter} placeholder='comment' className='outline-none  rounded-md  resize-none w-[100%] p-[5px] text-[13px] placeholder:font-light placeholder:text-[#6d6b69]'/>
            :
                <p className='w-[100%] outline-none rounded-md p-[5px] text-[13px] break-words'>{displayComment}</p>
        }
        <div className='flex gap-[10px] ml-[10px] items-center mb-[5px]'>

            <div className='flex items-center justify-center gap-[8px]'>
                <p className={showInfo ? 'text-[12px] text-[#000]' : 'text-[12px] text-[#fff]'}>{props.comment.date}</p>
                <p className={showInfo ? 'text-[13px] text-[#000] font-light' : 'text-[13px] text-[#fff] font-light'}>{props.comment.time}</p>
            </div>

            <div className={'gap-[0px] flex justify-center items-center'}>
            
                <div onClick={() => setEdit(true)} className='flex justify-center items-center h-[20px] w-[20px] p-[5px] rounded-sm cursor-pointer  hover:bg-[#eaeaea] hover:drop-shadow-lg ml-[20px]'>
                    <EditSharpIcon sx={{fontSize: "15px"}} />
                </div>
            
                

            <div onClick={() => props.deleteComment(desc)} className='flex justify-center items-center h-[20px] w-[20px] p-[5px] rounded-sm cursor-pointer  hover:bg-[#eaeaea] hover:drop-shadow-lg'>
                <DeleteIcon sx={{fontSize: "15px"}}/>
            </div>
        </div>
        </div>
    </div>
  )
}

export default Comment