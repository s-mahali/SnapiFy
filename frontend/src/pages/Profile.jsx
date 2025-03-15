import ProfileBody from '@/components/profile/ProfileBody'
import ProfileHeader from '@/components/profile/ProfileHeader'
import React from 'react'

const Profile = () => {
  return (
    <div className="min-h-screen ml-[17%] w-[72%] 
       px-4 py-2 ">
        <ProfileHeader/>
        <ProfileBody/>
    </div>
  )
}

export default Profile