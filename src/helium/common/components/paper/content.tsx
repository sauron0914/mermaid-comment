import type { FC, ReactElement, ReactNode } from 'react'
import { Loading } from '../loading'

interface Extra {
  label?: ReactElement;
  onClick?: () => void;
}

interface Item {
  label?: string | ReactNode;
  value?: ReactNode | string | number | (() => void);
  onClick?: () => void;
  extra?: Extra;
  hide?: boolean;
}
interface PaperContentType {
  data: Item[];
  title?: string;
  image?: string;
  loading?: boolean;
  onClick?: () => void;
  align?: string;
}
export const PaperContent: FC<PaperContentType> = (props) => {
  const { data = [], title, image, loading, onClick, align = 'left' } = props

  function renderExtra ({ label, onClick }: Extra) {
    return (
      <span onClick={onClick} style={{ marginLeft: 4, color: '#07C160' }}>
        {label}
      </span>
    )
  }

  function renderLabel (label, align) {
    if (!label) return null
    if (align === 'between') {
      return (
        <div className="text-[#848484] pr-2 my-1 flex-shrink-4 text-right">
          {label}
        </div>
      )
    }
    return <div className="text-[#585858]">{label} :</div>
  }

  function renderValue (align, { value, extra, onClick }: Item) {
    return (
      <div className={`flex-1 pl-2 text-${align === 'between' ? 'right text-[#1E1E1E]' : 'left text-[#848484]'}`}>
        <div onClick={onClick} className="break-all leading-6">
          <>
            {
                // 如果 label 是 function
                typeof value === 'function'
                  ? (
                    value()
                  )
                  : value

              }
            {extra && renderExtra(extra)}
          </>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div onClick={onClick}>
        <Loading />
      </div>
    )
  }

  return (
    <div onClick={onClick}>
      {title && <p>{title}</p>}

      <div>
        {image && (
          <div>
            <img src={image} alt="" />
          </div>
        )}
        <div>
          {data?.map((line, index): ReactElement | null => {
            if (!line.label && !line.value) {
              return null
            }
            if (line.hide) {
              return null
            }
            const { label } = line
            return (
              <div key={index}>
                <div className="flex py-[2px] text-[14px] leading-4 item-center">
                  {renderLabel(label, align)}
                  {renderValue(align, line)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
