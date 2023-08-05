import {React} from 'react'
import logoplaceholderimage from '../../assets/logo-placeholder-image.png'
import { Link } from 'react-router-dom'

const NavBarLogin = ({started}) => {


  return (
    started ? 
    <div className='h-[70px] drop-shadow-md bg-[#ffffff] flex items-center justify-between'>
        <Link to="/"><div className='flex gap-[15px] items-center ml-[30px] cursor-pointer'>
            <img alt='logo' className='h-[10.5vh]' src={logoplaceholderimage}/>
            <p className='text-[25px]'>Mesha</p>
        </div>
        </Link>
        <div className='mr-[30px]'>
            <Link to="/login"><div className=' cursor-pointer bg-[#4a6a8f] w-[80px] h-[5.5vh] rounded-md shadow-md flex justify-center items-center  hover:shadow-lg hover:bg-[#3a6391]'>
                <p className='text-[#ffffff] text-[15px]'>login</p>
            </div></Link>
        </div>
    </div>
    :
    <div className='h-[70px] drop-shadow-md bg-[#ffffff] flex items-center justify-between'>
        <Link to="/"><div className='flex gap-[15px] items-center ml-[30px] cursor-pointer'>
            <img alt='logo' className='h-[10.5vh]' src={logoplaceholderimage}/>
            <p className='text-[25px]'>Mesha</p>
        </div>
        </Link>
        <div className='mr-[30px]'>
            <Link to="/getstarted"><div className=' cursor-pointer bg-[#4a6a8f] w-[80px] h-[5.5vh] rounded-md shadow-md flex justify-center items-center  hover:shadow-lg hover:bg-[#3a6391]'>
                <p className='text-[#ffffff] text-[15px]'>sign up</p>
            </div></Link>
        </div>
    </div>
  )
}

export default NavBarLogin