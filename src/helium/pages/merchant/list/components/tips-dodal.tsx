import { unableSignProfitsReason, unableSignProfitsGuide } from './constant'
const numberMap = {
  1: '一',
  2: '二',
  3: '三',
}
export const computeWarningsText = ({ failReason, operateType, extData }) => {
  const reason = unableSignProfitsReason({ extData })[failReason]
  const operate = unableSignProfitsGuide()[operateType]
  const result = failReason !== 'NO_SHOP' ? '当前商户无法开通合同' : ''
  return (
    <div className="tips-modal-content">
      {!!result && <div className="text-[#f80219] mb-[10px] text-left">{result}</div>}
      {
        !!reason && (
          <div className="reason">
            <p>
              <strong>原因</strong>：<span>{reason}</span>
            </p>
          </div>
        )
      }
      <div className="mt-[10px]">
        {Array.isArray(operate)
          ? (
            operate.map((item, index) => {
              return (
                <p key={index} className="mt-[20px]]">
                  <span style={{ color: '#333' }}>
                    第{numberMap[index + 1]}步
                  </span>
                  ：<span>{item}</span>
                </p>
              )
            })
          )
          : (
            <p>
              <span>{operate}</span>
            </p>
          )}
        <br />
      </div>
    </div>
  )
}
