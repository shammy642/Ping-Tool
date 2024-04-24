import ping from 'ping';

export class PingManager {
    constructor() {
        this.isPinging = false;
    }

    checkPingingState = () => {
      return this.isPinging
    }
    
    setPingingState = (bool) => {
        this.isPinging = bool
    }

    doPing = async (hostList, timeOut) => {
        const pingPromises = hostList.map(host =>
            ping.promise.probe(host, {
                timeout: timeOut,
                extra: ["-i", 0.9]
            }).then(res => {
                return res.time === "unknown" ?
                    { "host": res.inputHost, "pingTime": 1000 } :
                    { "host": res.inputHost, "pingTime": res.time.toFixed(0) };
            })
        );
        const results = await Promise.all(pingPromises);
        return results
    };

    executePings = async (hostList, emitter) => {
        const pingInterval = setInterval(async () => {
            if (!this.isPinging) {
                clearInterval(pingInterval);
                console.log("Stopped pinging");
                return;
            }
    
            try {
                const pingResults = await this.doPing(hostList, 1);
                console.log("results :", pingResults);
                emitter(pingResults);
            } catch (error) {
                console.error("Error during ping:", error);
            }
        }, 1000); 
    }
}