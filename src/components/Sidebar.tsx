import { FC, ReactNode, useContext } from 'react'
import { ConfigContext } from '../ConfigContext';
import { RiBookLine, RiSettingsLine } from 'react-icons/ri'

const Sidebar:FC<{ children: ReactNode }>  = ({children}) => {
    const { sidebar } = useContext(ConfigContext);
    console.log('renderizou sidebar');
    return (
        <div className="w-40 sidebar">
            <div className="tabs">
                <button className="tab-materia"><RiBookLine /></button>
                <button className="tab-config"><RiSettingsLine /></button>
            </div>
            <div className='pl-4'>
                {children}
            </div>
        </div>
    )
}

export default Sidebar;