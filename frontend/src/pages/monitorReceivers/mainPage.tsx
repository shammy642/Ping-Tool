import { useContext, useEffect, useState } from "react";
import { ReceiverListContext } from "../../State Management/ReceiverListContext";
import { Grid, Typography } from "@mui/material";
import { Receiver } from "./Receiver";

export const MainPage = () => {
    const { receiverList } = useContext(ReceiverListContext) || {};
    const [receiverTypes, setReceiverTypes] = useState<string[]>([]);
    const [devices, setDevices] = useState<string[]>([])

    useEffect(() => {
        if (receiverList) {
            let receiverTypesList: string[] = [];
            const filteredSelectedReceivers = receiverList.filter((receiver) => receiver.isSelected)
            filteredSelectedReceivers.forEach((receiver) => {
                if (!receiverTypesList.includes(receiver.type)) {
                    receiverTypesList.push(receiver.type)
                }
            })
            setReceiverTypes(receiverTypesList)
        }
    }, [receiverList])

    useEffect(() => {
        if (receiverList) {
            let receiverDeviceList: string[] = [];
            const filteredSelectedReceivers = receiverList.filter((receiver) => receiver.isSelected)
            filteredSelectedReceivers.forEach((receiver) => {
                if (!receiverDeviceList.includes(receiver.device)) {
                    receiverDeviceList.push(receiver.device)
                }
            })
            console.log("Device list", receiverDeviceList)
            setDevices(receiverDeviceList)
        }
    }, [receiverList])

    return (
        <Grid container>
            {receiverTypes.map((receiverType) => {
                return <Grid item xs={12} md={2} key={"receiverType." + receiverType}>
                    <Typography variant="h6" fontWeight='bold'>{receiverType}</Typography>
                    <Grid item display="flex" flexDirection={{sx:"row", md:"column"}} flexWrap="wrap">
                    {receiverList && receiverList
                        .filter((receiver => (receiver.type === receiverType) && receiver.isSelected))
                        .map((receiver) => {
                            return <Grid item xs={6} md={12} key={"deviceBig." + receiver.id}>
                                <Receiver  IP={receiver.IP} id={receiver.id} name={receiver.name}/>
                            </Grid>
                        })}
                        </Grid>
                </Grid>

            })}
        </Grid>

        // <Grid container>
        //     {receiverTypes.map((receiverType) => {
        //         return <Grid item xs={12} md={2} key={"receiverType." + receiverType}>
        //             <Typography variant="h6" fontWeight='bold'>{receiverType}</Typography>
        //             <Grid item display="flex" flexDirection={{ sx: "row", md: "column" }} flexWrap="wrap">
        //                 {receiverList && receiverList
        //                 .filter((device => (device.type === receiverType))
        //                 )
        //                 .map((theDevice) => {
        //                     return <Grid item>
        //                         <Device device={theDevice.device} />
        //                     </Grid>
        //                 })}
        //             </Grid>
        //         </Grid>

        //     })}
        // </Grid>

    )
}