import { useContext, useState, useEffect } from "react";
import { ConfigContext } from "../ConfigContext";
import MateriaCard from "./MateriaCard";

interface IDropdown {
    [key: string]: boolean
}

const MateriasTab = () => {
    const { todasMaterias } = useContext(ConfigContext);
    const [dropdown, setDropdown] = useState<IDropdown>({})

    useEffect(() => {
        if(todasMaterias != null){
            const dropdownInicial:IDropdown = {}
            Object.keys(todasMaterias).map((periodo) => {
                dropdownInicial[periodo] = false
            })
            setDropdown(dropdownInicial)
        }
    }, [todasMaterias])
    
    const handleDropdown = (periodo: string) => {
        setDropdown((prevDropdown) => {
            return { ...prevDropdown, [periodo]: !prevDropdown[periodo] };
        });
    }
    
    return (
        <div>
             {todasMaterias != null &&
                Object.keys(todasMaterias).map((periodo) => {
                    const materiasDoPeriodo = todasMaterias[periodo]?.map(({ id, nome, horarios }) => (
                        <MateriaCard key={id} id={id} nome={nome} horarios={horarios} />
                    ));
                    return (
                        <div key={periodo}>
                            <div className='dropdown' onClick={() => handleDropdown(periodo)}>
                                <h3>{periodo}</h3>
                            </div>
                            {dropdown[periodo] ? materiasDoPeriodo : null}
                        </div>
                    );
                })
            }
        </div>
    )
}

export default MateriasTab;