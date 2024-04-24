import { Typography } from "@mui/material";
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper";
import { useContext, useEffect, useState } from "react";
import { WebsocketPingsContext } from "../../State Management/WebsocketPingsContext";


type ReceiverProps = {
  id: number;
  name: string;
  IP: string;
}

export const Receiver = (props: ReceiverProps) => {
  const { pingInfo } = useContext(WebsocketPingsContext) || {}
  const [ping, setPing] = useState<number>()

  useEffect(() => {
    if (pingInfo) {
      const thePingInfo = pingInfo.find(receiver => receiver.host === props.IP)?.pingTime
      setPing(thePingInfo)
    }
  }, [pingInfo, props.IP])

  const handleBackgroundColour = (ping:number) => {
    if (ping < 25) {
      return "green"
    }
    else if (ping < 50) {
      return "orange"
    }
    else {
      return "red"
    }
  }

  return (
    <Box>
      <Paper sx={{bgcolor: handleBackgroundColour(ping || 1000), margin: '5px', padding: '5px', overflow: 'hidden', display: 'flex', flexDirection: 'row', justifyContent:"space-between"}}>
        <Box display="flex" flexDirection="column" >
          <Typography variant="h6" color="white" fontSize={12} fontWeight='bold'>{props.name}</Typography>
          {/* <Typography  color="white" fontSize={10} fontWeight='bold'>{props.IP}</Typography> */}
        </Box>
        <Box>
          <Typography fontSize={12} fontWeight="bold" color="white">{ping}</Typography>
        </Box>
      </Paper>
    </Box>
  );
}