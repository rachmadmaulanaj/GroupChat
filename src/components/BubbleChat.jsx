import { useState, useEffect, useRef } from 'react';
import { Icon } from "@iconify/react";
import ICheckAll from "@iconify/icons-mdi/check-all";
import Moment from 'moment';
import 'moment/locale/id';

function BubbleChat(props) {
    const path_img = '/assets/images/';
    let chat_type_class = '';
    let chat_profile_class = '';
    let chat_icon_sent = '';
    let disabled_same_user = '';
    let is_same_user_next = props.next_senderID === props.chat.senderID ? true : false;
    const color_user = { color: props.userChat.color };
    if (props.userID === props.chat.senderID) {
        is_same_user_next = true;
        disabled_same_user = 'd-none';
        chat_type_class = 'chat-sent';
        chat_profile_class = 'chat-profile-sent';
        chat_icon_sent = <Icon icon={ICheckAll} width={'15px'} />;
    } else {
        chat_type_class = 'chat-received';
        chat_profile_class = 'chat-profile-received';
    }
    chat_profile_class += is_same_user_next ? ' invisible' : '';
    const chat_time = Moment.unix(props.chat.timestamp.seconds).format('HH:mm');

    return (
        <>
            <div className={is_same_user_next ? 'chat-bubble' : 'chat-bubble pt-2'}>
                <div className={chat_profile_class + ' ' + disabled_same_user}>
                    <img src={path_img + props.userChat.photo} alt={props.userChat.name + '-' + props.userChat.gender} className='rounded-circle w-100' />
                </div>
                <div className={chat_type_class}>
                    <div className={is_same_user_next ? 'd-none' : ''} style={color_user}><b>{props.userChat.name}</b></div>
                    <div>{props.chat.text}</div>
                    <div className='small' style={{ fontSize: '12px' }}>
                        {chat_time}
                        <span style={{ margin: '2px' }}></span>
                        {chat_icon_sent}
                    </div>
                </div>
            </div>
            <div className={props.tgl_next_el ? 'chat-tgl-ket' : 'chat-tgl-ket d-none'}>{props.tgl_next_el}</div>
        </>
    )
}

export default BubbleChat;