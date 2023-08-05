import {React, useEffect, useState} from 'react'
import docsLogo from '../../../assets/docsLogo.png'
import LinkIcon from '@mui/icons-material/Link';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#6a8099",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#6a8099",
  },
}));

const Tag = (props) => {

    const [name, setName] = useState('');
      
    useEffect(() => {
      if(props.name.length> 14) {
        setName(props.name.substring(0, 12) + '...')
      } else {
        setName(props.name);
      }
    }, [props.name])

    const a = `${props.date}     ${props.time}`

  if(props.type == 'document') {
    return (
      <BootstrapTooltip arrow  title={a} placement='bottom'><div className='w-[220px] shadow-md h-[70%] rounded-2xl flex items-center justify-center gap-[10px]'>
            <img className='h-[40px] items-center justify-center flex' src={docsLogo}/>
            <p className='text-[20px] font-light mt-[8px]'>{name}</p>
        </div></BootstrapTooltip>
      )
  } else if(props.type == 'link') {
    return (
      <BootstrapTooltip arrow  title={a} placement='bottom'><div className='w-[220px] shadow-md h-[70%] rounded-2xl flex items-center justify-center gap-[10px]'>
      <LinkIcon sx={{fontSize: '40px', color: "#c41a0e", marginTop: "10px"}}/>
      <p className='text-[20px] font-light mt-[8px]'>{name}</p>
  </div></BootstrapTooltip>
      )
  } else if(props.type == 'file') {
    return (
      <BootstrapTooltip arrow  title={a} placement='bottom'><div className='w-[220px] shadow-md h-[70%] rounded-2xl flex items-center justify-center gap-[10px]'>
      <CloudDownloadIcon sx={{fontSize: '40px', color: "#3a6391", marginTop: "2px"}}/>
      <p className='text-[20px] font-light mt-[8px]'>{name}</p>
  </div></BootstrapTooltip>
      )
  }
}

export default Tag