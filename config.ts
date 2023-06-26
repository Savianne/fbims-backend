
interface IConfig {
    allowCORS: false | "*" | string[];
}

const config:IConfig = {
    allowCORS: false
}

export default config;