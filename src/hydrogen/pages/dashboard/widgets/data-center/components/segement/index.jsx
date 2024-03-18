import PropTypes from 'prop-types'
import classnames from 'classnames'
import { uuid } from '@dian/app-utils'

function Segement ({ data, onClick, activeTab, theme }) {
  const classname = classnames('rounded-t-lg overflow-hidden h-22 mb-8 leading-22', {
    'h-auto leading-normal bg-gray-200': theme === 'white',
  })
  return (
    <div className={classname}>
      <div className="p-2 flex-nowrap overflow-x-auto overflow-scroll-touch">
        {data.map((e, index) => {
          const title = e.split(',')[0] // 支持通过“BD,9000”（label, id)这种神奇方式传值
          return (
            <div
              className={classnames('p-2 text-black border-transparent', { 'text-green-500 bg-white border border-green-500 rounded-md': activeTab === index })}
              key={uuid()}
              onClick={() => onClick(e, index)}
            >
              {title}
            </div>
          )
        })}
      </div>
    </div>
  )
}
Segement.propTypes = {
  data: PropTypes.array,
  onClick: PropTypes.func,
  activeTab: PropTypes.number,
}

Segement.defaultProps = {
  activeTab: '0',
}

export default Segement
