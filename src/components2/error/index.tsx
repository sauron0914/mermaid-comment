export interface ErrorProps {
  /**
   * 文字描述
   */
  text?: string
}

export default function Error ({ text = '异常错误' }: ErrorProps) {
  return (
    <div className="pt-[50px] text-center text-[#999999]">
      <img className="inline-block max-w-[160px] mb-[20px]" src="https://fed.dian.so/fed/result-syserror.png" />
      <p>{text}</p>
    </div>
  )
}
