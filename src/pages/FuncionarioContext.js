import React, { createContext, useState, useContext } from 'react'

const FuncionárioContext = createContext();

export const FuncionárioProvider = ({ children }) =>{
    const [funcionario, setFuncionario] = useState(null);

    return(
        <FuncionárioContext.Provider value={{ funcionario, setFuncionario }}>
            {children}    
        </FuncionárioContext.Provider>
    );
};

export const useFuncionario = () => useContext(FuncionárioContext);