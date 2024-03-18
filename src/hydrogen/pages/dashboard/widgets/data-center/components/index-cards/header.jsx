import { useMemo, useEffect, useContext } from 'react'

import Context from './context'

function HeaderWrap (props) {
  const { dispatch } = useContext(Context)
  useEffect(() => {
    dispatch({
      type: 'addHeader',
      payload: { el: <Header {...props} /> },
    })
  }, [])
  return null
}

function Header (props) {
  const { title, subtitle, children } = props

  const header = useMemo(() => {
    if (title || subtitle) {
      return (
        <>
          {title ? <div className="text-sm transform origin-left break-all leading-6 text-gray-700">{title}</div> : null}
          {subtitle ? <div className="text-sm transform origin-left break-all leading-6 text-gray-700">{subtitle}</div> : null}
        </>
      )
    }
    return children
  }, [title, subtitle, children])
  return <div>{header}</div>
}

export default HeaderWrap
