import { useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import './index.css'

function Switch ({ defaultChecked, fields, className, onClick }) {
  const [checked, setChecked] = useState(defaultChecked)

  function handleClick () {
    const next = !checked
    onClick && onClick(next)
    setChecked(next)
  }

  return (
    <div
      className={classnames(
        'target-switch w-44 h-26 rounded-full bg-gray-300 relative',
        { 'bg-green-500 before:scale-0 after:translate-x-20': checked },
        className,
      )}
      onClick={handleClick}
    >
      {fields && (
        <span className={classnames({ 'absolute z-2 top-8 translate-x-25 text-gray-400': true, 'transform translate-x-10 text-white': checked })}>
          {fields[checked ? 0 : 1]}
        </span>
      )}
    </div>
  )
}

Switch.propTypes = {
  defaultChecked: PropTypes.bool,
  fields: PropTypes.array,
  className: PropTypes.string,
  onClick: PropTypes.func,
}

Switch.defaultProps = {
  defaultChecked: false,
}

export default Switch
