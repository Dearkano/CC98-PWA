import React from 'react'
import { debounce } from 'lodash-es'

import LoadingCircle from '@/components/LoadingCircle'


type Props = {
  /**
   * 列表正在加载中，回调不会重复触发
   */
  isLoading: boolean
  /**
   * 列表已加载完成，不需要再触发回调
   */
  isEnd: boolean
  /**
   * 列表底部 loading 出现的回调
   */
  callback: (...args: any[]) => any
}


class InfinieList extends React.PureComponent<Props> {
  /**
   * 存储 debounce 之后的函数
   */
  bindFunc: () => void
  /**
   * loading 图标 <CircularProgress />
   */
  loadingDom = React.createRef<HTMLDivElement>()

  componentDidMount() {
    const func = () => {
      const { isLoading, isEnd, callback } = this.props
      if (isLoading || isEnd)
        return

      // loadingDom 出现在可视区域
      const distance = this.loadingDom.current
        && (window.innerHeight - this.loadingDom.current.getBoundingClientRect().top)

      if (distance === null || distance < 0)
        return

      callback()
    }

    this.bindFunc = debounce(func, 250)
    window.addEventListener('scroll', this.bindFunc)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.bindFunc)
  }

  render() {
    const { isEnd, children } = this.props

    return (
      <>
        {children}
        {!isEnd && <div ref={this.loadingDom}>
            <LoadingCircle />
          </div>
        }
      </>
    )
  }
}

export default InfinieList
