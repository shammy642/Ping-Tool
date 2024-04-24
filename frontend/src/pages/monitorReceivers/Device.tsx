import { useContext } from "react";
import { ReceiverListContext } from "../../State Management/ReceiverListContext";
import { Receiver } from "./Receiver";
import { Grid, Typography } from "@mui/material";

type DeviceProps = {
    device: string;
}

export const Device = (props: DeviceProps) => {
    const { receiverList } = useContext(ReceiverListContext) || {};

    return (<Grid spacing={1} container >
        <Grid item><Typography>{props.device}</Typography></Grid>
        
        {receiverList && receiverList
            .filter((receiver => (receiver.device === props.device) && receiver.isSelected))
            .map((receiver) => {
                return <Grid item key={"receiver." + receiver.id}>
                    <Receiver IP={receiver.IP} id={receiver.id} name={receiver.name} />
                </Grid>
            })}
    </Grid>)
}