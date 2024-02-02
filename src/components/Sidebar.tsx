import { FC, ReactNode, useContext } from 'react'
import { ConfigContext } from '../ConfigContext';
import { RiBookLine, RiSettingsLine, RiBookFill, RiSettingsFill } from 'react-icons/ri'

const Sidebar:FC<{ children: ReactNode }>  = ({children}) => {
    const { isSidebarMateria, setIsSidebarMateria } = useContext(ConfigContext);
    console.log('renderizou sidebar');
    return (
        <div className="w-60 sidebar">
            <div className="tabs">
                <button className={`tab-materia ${isSidebarMateria ? 'tab-ativa' : ''}`}
                        onClick={() => setIsSidebarMateria(true)} >
                    {isSidebarMateria ? <RiBookFill /> : <RiBookLine />}
                </button>
                <button className={`tab-config ${!isSidebarMateria ? 'tab-ativa' : ''}`}
                        onClick={() => setIsSidebarMateria(false)}>
                    {!isSidebarMateria ? <RiSettingsFill /> : <RiSettingsLine />}
                </button>
            </div>
            <div className='pl-4 pt-4 pr-4'>
                {children}
            </div>
        </div>
    )
}

export default Sidebar;