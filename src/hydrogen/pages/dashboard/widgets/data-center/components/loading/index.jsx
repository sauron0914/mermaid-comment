export default function Loading (
  {
    helperText,
  },
) {
  return (
    <div className="text-center pt-50">
      <img className="block w-75 mx-auto mb-10" src="//fed.dian.so/lhc/2017/09/18/500w_500h_1D0691505722454.gif" />
      <p className="text-gray-500 text-base my-10 mb-15">{helperText || '努力加载中...'}</p>
    </div>
  )
}
