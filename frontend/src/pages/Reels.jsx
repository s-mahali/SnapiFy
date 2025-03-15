import React from 'react'
import Reel from '@/components/reels/Reel';
import { useSelector } from 'react-redux';

const Reels = ({reel}) => {
  const allReels = useSelector((state) => state.reel.reels);

  if(reel){
    return (
      <>
        <Reel key={reel._id} reel={reel} />
      </>
    );
  }

  return (
    <>
      {
        allReels?.map((reel) => (
          <Reel key={reel._id} reel={reel} />
        ))
      }
    </>
  )
}

export default Reels