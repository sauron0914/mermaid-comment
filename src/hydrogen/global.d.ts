declare module '*.less' {
  const content: { [key: string]: any }
  export default content
}
declare module '*.png';
declare module '*.jgp';
interface Window {
  xdlog: any // 上报相关，TODO:更具体一点
}
