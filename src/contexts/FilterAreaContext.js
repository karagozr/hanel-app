import React, { useState, createContext, useContext, useEffect } from 'react';

const FilterAreaContext = createContext({});
// const useFilterArea = () => useContext(FilterAreaContext);

const useFilterArea = () => React.useContext(FilterAreaContext)

const FilterAreaProvider = (props) => {
    
    const [filterData, setFilterData] = useState({});

    return ( <FilterAreaContext.Provider value={{ filterData, setFilterData }} {...props} />  );
}

export {
    FilterAreaProvider,
    useFilterArea
}
