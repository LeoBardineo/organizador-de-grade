import { FC, ReactNode } from 'react'
import { useStore } from '../store';
import { RiBookLine, RiSettingsLine, RiBookFill, RiSettingsFill } from 'react-icons/ri'

const Sidebar: FC<{ children: ReactNode }> = ({ children }) => {
    const isSidebarMateria = useStore(state => state.isSidebarMateria);
    const setIsSidebarMateria = useStore(state => state.setIsSidebarMateria);

    return (
        <div className="w-[340px] shrink-0 sidebar">
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
            <div className='pl-4 pt-4 pr-4 flex-1 overflow-y-auto'>
                {children}
            </div>
        </div>
    )
}

export default Sidebar;