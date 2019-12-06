const { Console } = require('console')
const { config } = require('../../config/app.config')

const src = config.get('app')

// The Console class can be used to create ap simple logger with configurable output streams
const logger = new Console({ stdout: process.stdout, stderr: process.stderr })

const logLevels: any = {
    // High priority
    ERROR: 1,
    WARN: 2,
    INFO: 3,
    DEBUG: 4,
    TRACE: 5,
    // Low priority
}

interface logObj {
    level: string
    source: string
    message: string
    requestID: string
    requestMethod: string
    URL: string
    logType: string
    tag: string
    error: string
    label: string
    filename: string
}

const defaultLogType = 'application'

let defaultLogLevelIndex: any = 1
let defaultLogLevel = 'INFO'

/**
 * @author Shreevatsa
 * @description This function will set the default log level
 */
const setLogLevel = (level = 'INFO') => {
    const loglevel = level ? level.toUpperCase() : 'INFO'
    if (logLevels[loglevel]) {
        defaultLogLevelIndex = logLevels[loglevel]
        defaultLogLevel = loglevel
    } else {
        defaultLogLevelIndex = logLevels.INFO
        defaultLogLevel = 'INFO'
    }
}

const getLogLevel = () => {
    return defaultLogLevel
}

const getCommonLogObj = (logObj: logObj) => {
    return {
        level: logObj.level,
        source: logObj.source,
        message: logObj.message,
        requestID: logObj.requestID,
        timestamp: new Date().toISOString(),
        label: logObj.label,
        logType: logObj.logType,
        tag: logObj.tag,
    }
}

const setErrorObj = (logObj: logObj) => {
    const obj = getCommonLogObj(logObj)
    return {
        ...obj,
        errorStack: logObj.error ? logObj.error.substring(0, 300) : '',
    }
}

const setWarnObj = (logObj: logObj) => {
    return getCommonLogObj(logObj)
}

const setInfoObj = (logObj: logObj) => {
    return getCommonLogObj(logObj)
}

const setDebugObj = (logObj: logObj) => {
    const obj = getCommonLogObj(logObj)
    return {
        ...obj,
        requestMethod: logObj.requestMethod,
        URL: logObj.URL,
        errorStack: logObj.error ? logObj.error.substring(0, 300) : '',
        label: logObj.label,
        filename: logObj.filename,
    }
}

const setTraceObj = (logObj: logObj) => {
    const obj = getCommonLogObj(logObj)
    return {
        ...obj,
        requestMethod: logObj.requestMethod,
        errorStack: logObj.error ? logObj.error.substring(0, 300) : '',
    }
}
const getLogInfo = (level: string, logObj: logObj) => {
    let logLevelObj
    switch (level) {
        case 'INFO':
            logLevelObj = setInfoObj(logObj)
            break
        case 'ERROR':
            logLevelObj = setErrorObj(logObj)
            break
        case 'WARN':
            logLevelObj = setWarnObj(logObj)
            break
        case 'TRACE':
            logLevelObj = setTraceObj(logObj)
            break
        case 'DEBUG':
            logLevelObj = setDebugObj(logObj)
            break
        default:
            logLevelObj = setInfoObj(logObj)
    }

    let { timestamp, source, message } = logLevelObj
    if (!timestamp) timestamp = ''
    if (!source) source = ''
    if (!message) message = ''
    const isipcore = { ...logLevelObj }

    delete isipcore.timestamp
    delete isipcore.source
    delete isipcore.message
    delete isipcore.level

    const modifiedLog = { timestamp, source, level, message, isipcore }

    return modifiedLog
}

const setLogobj = (obj: any, loglevel: string) => {
    const logObj: logObj = {
        level: loglevel,
        source: src,
        message: '',
        requestID: '',
        requestMethod: '',
        URL: '',
        logType: '',
        tag: '',
        error: '',
        label: '',
        filename: '',
    }
    const fileNameArray = obj.filename ? obj.filename.split('/') : ''
    logObj.message = obj.message
    if (obj.req) {
        logObj.requestID = obj.req.requestID
        logObj.requestMethod = obj.req.method
        logObj.URL = `${obj.req.protocol}://${obj.req.get('host')}${obj.req.originalUrl}`
    }
    logObj.logType = obj.logType ? obj.logType : defaultLogType
    logObj.tag = obj.tag ? obj.tag : ''
    logObj.error = obj.error
    logObj.label = obj.label
    logObj.filename = fileNameArray[fileNameArray.length - 1]
    return logObj
}

const logUtil = (level: string, obj: any) => {
    try {
        const loglevel = level.toUpperCase()
        if (logLevels[loglevel] <= defaultLogLevelIndex) {
            if (Object.entries(obj).length !== 0) {
                const updatedLogObj = setLogobj(obj, loglevel)
                logger[level.toLowerCase()](JSON.stringify(getLogInfo(loglevel, updatedLogObj)))
            } else {
                const logObj = {
                    level: 'ERROR',
                    source: src,
                    message: 'received empty paramaters to log',
                }
                logger.error(JSON.stringify(logObj))
            }
        }
    } catch (error) {
        const logObj = {
            level: 'ERROR',
            source: src,
            message: `Something went wrong in logger utility ${error}`,
        }
        logger.error(JSON.stringify(logObj))
    }
}
const info = (obj: any) => {
    logUtil('INFO', obj)
}

const error = (obj: any) => {
    logUtil('ERROR', obj)
}

const debug = (obj: any) => {
    logUtil('DEBUG', obj)
}

const trace = (obj: any) => {
    logUtil('TRACE', obj)
}

const warn = (obj: any) => {
    logUtil('WARN', obj)
}
const log = {
    info,
    error,
    debug,
    trace,
    warn,
    setLogLevel,
    getLogLevel,
}
export default log
