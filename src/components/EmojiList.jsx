import { useEffect } from 'react';
import { Dropdown } from 'bootstrap/dist/js/bootstrap.bundle';
import { Icon } from '@iconify/react';
import ISmile from '@iconify/icons-mdi/smiley-outline';

const EmojiList = (props) => {

    useEffect(() => {
        new Dropdown(document.getElementById('emot-send-button'));
        const emojiList = document.querySelectorAll('.emoji');
        emojiList.forEach((emoji) => {
            emoji.addEventListener('click', (e) => {
                props.setInputText((prev_value) => prev_value + e.target.innerHTML);
            });
        });
    }, []);

    return (
        <div className='dropdown'>
            <button className='btn btn-sm btn-light ml-2 mr-1' type='button' id='emot-send-button' data-bs-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                <Icon icon={ISmile} width={'25px'} />
            </button>
            <div className='dropdown-menu dropdown-menu-right' aria-labelledby='emot-send-button'>
                <h6 className='dropdown-header'>Emoji</h6>
                <div className='p-2'>
                    <ul className='emoji-list'>
                        <li><span className='emoji'>&#128515;</span></li>
                        <li><span className='emoji'>&#128516;</span></li>
                        <li><span className='emoji'>&#128513;</span></li>
                        <li><span className='emoji'>&#128518;</span></li>
                        <li><span className='emoji'>&#128517;</span></li>
                        <li><span className='emoji'>&#129315;</span></li>
                        <li><span className='emoji'>&#128514;</span></li>
                        <li><span className='emoji'>&#128578;</span></li>
                    </ul>
                    <ul className='emoji-list'>
                        <li><span className='emoji'>&#128579;</span></li>
                        <li><span className='emoji'>&#128521;</span></li>
                        <li><span className='emoji'>&#128522;</span></li>
                        <li><span className='emoji'>&#128519;</span></li>
                        <li><span className='emoji'>&#129392;</span></li>
                        <li><span className='emoji'>&#128525;</span></li>
                        <li><span className='emoji'>&#129321;</span></li>
                        <li><span className='emoji'>&#128536;</span></li>
                    </ul>
                    <ul className='emoji-list'>
                        <li><span className='emoji'>&#128535;</span></li>
                        <li><span className='emoji'>&#128523;</span></li>
                        <li><span className='emoji'>&#128541;</span></li>
                        <li><span className='emoji'>&#129322;</span></li>
                        <li><span className='emoji'>&#129297;</span></li>
                        <li><span className='emoji'>&#129303;</span></li>
                        <li><span className='emoji'>&#129325;</span></li>
                        <li><span className='emoji'>&#129323;</span></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default EmojiList;