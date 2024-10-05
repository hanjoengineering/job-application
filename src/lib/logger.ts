import { Logger } from 'tslog'

const logger = new Logger()
logger.attachTransport((logObj) => {
    fetch("https://papertrailapp.com/api/v1/site.json", {
        method: "POST",
        headers: {
            "X-Papertrail-Token": "kDGgnbMOV9eJqdipO6xJ"
        },
        body: JSON.stringify(logObj)
    })
});

export default logger