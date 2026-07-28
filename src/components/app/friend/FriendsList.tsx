import { FC } from 'react'
import Card from '../../shared/Card'
import SmallButton from '../../shared/SmallButton'
import useSWR, { mutate } from 'swr'
import Fetcher from '../../../lib/Fetcher'
import { Empty, Skeleton } from 'antd'
import CatchError from '../../../lib/CatchError'
import HttpInterceptor from '../../../lib/HttpInterceptor'


interface FriendsListInterface {
  gap?: number
  columns?: number
}

const FriendsList: FC<FriendsListInterface> = ({ gap = 8, columns = 2 }) => {
  const { data, error, isLoading } = useSWR("/friend", Fetcher)

  const unfriend = async (id: string) => {
    try {
      await HttpInterceptor.delete(`/friend/${id}`)
      mutate("/friend")
      mutate('/friend/suggestion')
    }
    catch (err) {
      CatchError(err)
    }
  }

  if (isLoading)
    return <Skeleton active />

  if (error)
    return <Empty />

  if (data.length === 0)
    return <Empty />

  return (
    <div className={`grid grid-cols-${columns} gap-${gap}`}>
      {
        data.map((item: any) => (
          <Card>
            <div className='flex flex-col items-center gap-3 w-full min-w-0'>
              <img
                src={item.friend.image || "/images/avtar.jpg"}
                className='rounded-full object-cover w-[80px] h-[80px]'
              />
              <h1 className='capitalize'>{item.friend.fullname}</h1>
              <div className='relative'>
                {
                  item.status === "requested" ?
                    <SmallButton icon='check-double-line'>Request sent</SmallButton>
                    :
                    <SmallButton type="danger" icon="user-minus-line" onClick={() => unfriend(item._id)}>Unfriend</SmallButton>
                }
                
              </div>
            </div>
          </Card>
        ))
      }
    </div>
  )
}

export default FriendsList