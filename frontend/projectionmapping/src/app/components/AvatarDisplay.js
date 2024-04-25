// TODO: Build react component for displaying avatars
import React from 'react'

function AvatarDisplay(props) {
    return(
        <div className='avatar-con px-4 py-2'>{props.name}</div>
    )
}

export default AvatarDisplay