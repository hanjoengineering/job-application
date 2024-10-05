import { Logger } from 'tslog'
import {Logging} from '@google-cloud/logging-min';

const logging = new Logging({projectId: ''});

const log = logging.log('site');

const logger = new Logger()
logger.attachTransport((logObj) => {
    // const metadata = {
    //     resource: {type: 'global'},
    //     // See: https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity
    //     severity: 'INFO',
    //   };

      
    // const entry = log.entry(metadata, JSON.stringify(logObj));

    // log.write(entry);

    fetch("https://papertrailapp.com/api/v1/site.json", {
        headers: {
            "X-Papertrail-Token": "kDGgnbMOV9eJqdipO6xJ"
        },
        body: JSON.stringify(logObj)
    })
});

export default logger