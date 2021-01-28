const isProduction = process.env.NODE_ENV === 'production';
const LogService = {
  warn: (log) => {
    if(isProduction){
      return;
    }
    console.warn(log);
  },
  info: (message, info) => {
    if(isProduction){
      return;
    }
    console.log(message);
    console.log(info);
  },
  error: (message, error) => {
    if(isProduction){
      return;
    }
    console.error(message);
    console.error(error);
  }
}

module.exports = LogService;