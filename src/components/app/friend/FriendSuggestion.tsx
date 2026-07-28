import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import Card from '../../shared/Card';
import SmallButton from '../../shared/SmallButton';
import Fetcher from '../../../lib/Fetcher';
import useSWR, { mutate } from 'swr';
import { Empty, Skeleton } from 'antd';
import CatchError from '../../../lib/CatchError';
import HttpInterceptor from '../../../lib/HttpInterceptor';
import { toast } from 'react-toastify';

const FriendsSuggestion = () => {
  const { data, error, isLoading } = useSWR('/friend/suggestion', Fetcher)

  if (isLoading)
    return <Skeleton active />

  if (error)
    return <Empty />

  const sendFriendRequest = async (id: string) => {
    try {
       await HttpInterceptor.post('/friend', { friend: id })
       mutate('/friend/suggestion')
       mutate("/friend")
      toast.success("Friend request sent",{position: 'top-center'} )
    }
    catch (err) {
      CatchError(err)
    }
  }

  return (
    <Card title="Suggestions" divider>
      {
        data.length === 0 &&
        <Empty />
      }
      <div>
        <Swiper
          slidesPerView={2}
          spaceBetween={30}
          className="mySwiper"
        >
          {
            data.map((item: any, index: number) => (
              <SwiperSlide key={index}>

                <div className='flex flex-col items-center gap-2 border border-gray-100 p-3 rounded-lg'>
                  <img
                    src={item.image || "/images/avtar.jpg"}
                    className="w-[80px] h-[80px] rounded-full object-cover"
                  />
                  <h1 className='text-base font-medium text-black capitalize'>{item.fullname}</h1>
                  <SmallButton type='success' icon="user-add-line" onClick={() => sendFriendRequest(item._id)}>Add</SmallButton>
                </div>
              </SwiperSlide>
            ))
          }
        </Swiper>
      </div>
    </Card>
  );
}

export default FriendsSuggestion
