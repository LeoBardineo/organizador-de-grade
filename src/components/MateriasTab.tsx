import { useContext, useEffect, useState } from "react";
import { ConfigContext } from "../ConfigContext";

const MateriasTab = () => {
    const { todosMateriasCards } = useContext(ConfigContext);
    console.log(todosMateriasCards)
    return (
        <>
            {todosMateriasCards?.flat()}
        </>
    )
}

export default MateriasTab;