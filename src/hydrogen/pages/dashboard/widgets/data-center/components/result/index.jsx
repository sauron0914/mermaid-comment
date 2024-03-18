import Empty from '@/common/components/empty'

export default function Result (props) {
  const { type, msg } = props
  return (
    <div style={{ textAlign: 'center', marginTop: '30%' }}>
      {type === 'empty' && (
        <Empty text="暂无相关内容" />
      )}
      {type === 'error' && (
        <Empty type={1} text={msg || '服务器开小差了'} />
      )}
    </div>
  )
}
