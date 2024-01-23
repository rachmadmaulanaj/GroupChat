import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import ILink from '@iconify/icons-mdi/link-variant';
import ISend from '@iconify/icons-mdi/send';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import EmojiList from './EmojiList';

function InputChat(props) {
    const [inputText, setInputText] = useState('');
    const isButtonDisabled = inputText.trim() === '';

    const handleInputTextChange = (e) => {
        setInputText(e.target.value);
    }
    const handleButtonSendClick = async () => {
        const collection_messages = collection(db, 'group_chat_messages');
        const doc_messages = await addDoc(collection_messages, {
            deleted: false,
            senderID: props.user.id,
            text: inputText,
            timestamp: new Date(),
        });

        if (!doc_messages.id) {
            Swal.fire({
                position: 'top',
                showConfirmButton: false,
                showCloseButton: true,
                toast: true,
                icon: 'error',
                text: 'Koneksi bermasalah!'
            });
            return false;
        }
        setInputText('');
    }
    const handleInputEnter = (e) => {
        if (e.key === 'Enter') {
            handleButtonSendClick();
        }
    }

    return (
        <div className='chat-input'>
            <input type='text' className='form-control' placeholder='Ketik pesan' value={inputText} onChange={handleInputTextChange} onKeyDown={handleInputEnter} />

            <EmojiList setInputText={setInputText} />

            <input type='file' className='d-none' id='image-send-input' accept='.png,.jpg,.jpeg' />
            <button className='btn btn-sm btn-light ml-1 mr-1 d-none' type='button' id='image-send-button' disabled>
                <Icon icon={ILink} width={'25px'} />
            </button>

            <button className='btn btn-sm bg-teal text-white ml-1 mr-2' type='button' onClick={handleButtonSendClick} disabled={isButtonDisabled}>
                <Icon icon={ISend} width={'25px'} />
            </button>
        </div>
    )
}

export default InputChat;