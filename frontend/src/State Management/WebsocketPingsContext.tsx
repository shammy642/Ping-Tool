import { createContext, useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";


export type PingResult = {
    host: string;
    pingTime: number;
}

export type WebsocketPingsContextType = {
    pingInfo: PingResult[] | undefined;

}

export const WebsocketPingsContext = createContext<WebsocketPingsContextType | undefined>(undefined)

type WebsocketPingsProviderProps = {
    children: React.ReactNode;
};

export const WebsocketPingsProvider = (props: WebsocketPingsProviderProps) => {
    const [pingInfo, setPingInfo] = useState<PingResult[] | undefined>();
    const socketUrl = process.env.REACT_APP_BACKEND_WS ? process.env.REACT_APP_BACKEND_WS : 'ws://localhost:3001' ;

    const { lastJsonMessage } = useWebSocket(socketUrl, {
        onOpen: () => console.log('WebSocket opened'),
        onClose: () => console.log('WebSocket closed'),
        shouldReconnect: (closeEvent) => true, // Will attempt to reconnect on all close events
    });

    useEffect(() => {
        if (lastJsonMessage !== null) {
            console.log('Received WebSocket message:', lastJsonMessage);
            setPingInfo(lastJsonMessage);
        }
    }, [lastJsonMessage]);

    return (
        <WebsocketPingsContext.Provider value={{ pingInfo }}>
            {props.children}
        </WebsocketPingsContext.Provider>
    );
}