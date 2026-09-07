import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import Card from '../../shared/Card';
import SmallButton from '../../shared/SmallButton';
import useSWR, { mutate } from 'swr';
import Fetcher from '../../../lib/Fetcher';
import { Empty, Skeleton } from 'antd';
import CatchError from '../../../lib/CatchError';
import HttpInterceptor from '../../../lib/HttpInterceptor';

const FriendsRequest = () => {
  const { data, isLoading, error } = useSWR('/friend/request', Fetcher)

   const acceptFriend = async (id: string) =>{
        try{
          await HttpInterceptor.put(`/friend/${id}`, {status : 'accepted'})
          mutate('/friend/request')
           mutate('/friend')
        }
        catch(err)
        {
          CatchError(err)
        }
   }

  if (isLoading)
    return <Skeleton />

  if (error)
    return <Empty />

  return (
    <Card title="Requests" divider>
      <div>
        {
          data.length === 0 &&
          <Empty />
        }
        <Swiper
          slidesPerView={2}
          spaceBetween={30}
          className="mySwiper"
        >
          {
            data.map((item: any, index: number) => (
              <SwiperSlide key={index}>

                <div className='flex flex-col items-center gap-2 border border-gray-100 p-3 rounded-lg'>
                  <img src={item.user?.image || "/images/avtar.jpg"} className="w-[80px] h-[80px] rounded-full object-cover" />
                  <h1 className='text-base font-medium text-black capitalize truncate max-w-full'>{item.user?.fullname || "User"}</h1>
                  <SmallButton type='warning' icon="check-double-line" onClick={()=>acceptFriend(item._id)}>Accept</SmallButton>
                </div>


              </SwiperSlide>
            ))
          }
        </Swiper>
      </div>
    </Card>
  );
}

export default FriendsRequest
