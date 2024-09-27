import React, { createContext, useEffect, useState } from "react";

export type ReceiverObjectProps = {
  id: number;
  name: string;
  IP: string;
  device: string;
  type: string;
  isSelected: string;
}

export type ReceiverListContextType = {
  receiverList: ReceiverObjectProps[] | undefined;
  updateReceiverListState: (state:ReceiverObjectProps[]) => void;
}

export const ReceiverListContext = createContext<ReceiverListContextType | undefined>(undefined);

type ReceiverListProps = {
  children: React.ReactNode;
}

export const ReceiverListProvider = (props: ReceiverListProps) => {
  const [receiverList, setReceiverList] = useState<ReceiverObjectProps[] | undefined>();
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setReceiverList(data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const updateReceiverListState = (state:ReceiverObjectProps[]) => {
    setReceiverList(state)
  }

  return (
    <ReceiverListContext.Provider value={{ receiverList, updateReceiverListState }}>
      {props.children}
    </ReceiverListContext.Provider>
  )
}
