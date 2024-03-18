import { useMemo } from 'react'
import classnames from 'classnames'
import PropTyeps from 'prop-types'
import { formatRate } from '../../utils/format'

function RateText ({ text, className }) {
  const mixClassName = useMemo(() => {
    return classnames(
      className,
      {
        'text-red-500': text !== '-' && text > 0,
      },
      {
        'text-green-500': text !== '-' && text < 0,
      },
    )
  }, [className, text])

  return <span className={mixClassName}>{formatRate(text)}</span>
}

RateText.propTypes = {
  text: PropTyeps.oneOfType([PropTyeps.string, PropTyeps.number]),
  className: PropTyeps.string,
}

RateText.defaultProps = {
  text: '-',
}

export default RateText
