import { useState, useEffect, useRef } from 'react';
import { db } from './firebase';
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import BubbleChat from './components/BubbleChat';
import InputChat from './components/InputChat';
import { Icon } from '@iconify/react';
import ILogout from '@iconify/icons-mdi/logout';
import Swal from 'sweetalert2';

function ChatPage(props) {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [unsubscribeUsers, setUnsubscribeUsers] = useState(null);
    const [unsubscribeMessages, setUnsubscribeMessages] = useState(null);

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    const handleButtonLogoutClick = () => {
        Swal.fire({
            customClass: {
                confirmButton: "btn bg-teal text-white me-3",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false,
            position: 'top',
            icon: 'question',
            text: 'Yakin keluar?',
            showCancelButton: true,
            confirmButtonText: 'Keluar',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    position: 'top',
                    showConfirmButton: false,
                    showCloseButton: true,
                    toast: true,
                    icon: 'success',
                    text: 'Berhasil keluar!',
                    timer: 3000,
                });
                setTimeout(() => {
                    props.onRemoveUser();
                }, 1000);
            } else if (result.isDenied) {
                return false;
            }
        });
    }
    const getDataUsers = () => {
        const collection_users = collection(db, 'group_chat_users');
        return onSnapshot(collection_users, (querySnapshot) => {
            let users_arr = [];
            querySnapshot.forEach((data) => {
                users_arr.push({ id: data.id, ...data.data(), color: getRandomColor() });
            });
            setUsers(...users, users_arr);
        });
    }
    const getDataMessages = () => {
        const collection_messages = collection(db, 'group_chat_messages');
        const query_messages = query(collection_messages, orderBy('timestamp', 'asc'));
        return onSnapshot(query_messages, (querySnapshot) => {
            let messages_arr = [];
            querySnapshot.forEach((data) => {
                messages_arr.unshift({ id: data.id, ...data.data() });
            });
            setMessages(...messages, messages_arr);
        });
    }
    const unsubscribe = () => {
        if (unsubscribeUsers) {
            unsubscribeUsers();
            setUnsubscribeUsers(null);
            console.log('unsub user');
        }
        if (unsubscribeMessages) {
            unsubscribeMessages();
            setUnsubscribeMessages(null);
            console.log('unsub message');
        }
    }

    const convertDatePrevious = (tgl_db) => {
        let tgl_db_format = new Date(tgl_db.getTime() - (tgl_db.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);

        let tgl_sekarang = new Date();
        let tgl_sekarang_format = new Date(tgl_sekarang.getTime() - (tgl_sekarang.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);

        let tgl_kemarin = new Date(tgl_sekarang);
        tgl_kemarin.setDate(tgl_kemarin.getDate() - 1);
        let tgl_kemarin_format = new Date(tgl_kemarin.getTime() - (tgl_kemarin.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);

        let tgl_awal_seminggu = new Date(tgl_sekarang);
        tgl_awal_seminggu.setDate(tgl_awal_seminggu.getDate() - 2);
        let tgl_awal_seminggu_format = new Date(tgl_awal_seminggu.getTime() - (tgl_awal_seminggu.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);

        let tgl_akhir_seminggu = new Date(tgl_sekarang);
        tgl_akhir_seminggu.setDate(tgl_akhir_seminggu.getDate() - 6);
        let tgl_akhir_seminggu_format = new Date(tgl_akhir_seminggu.getTime() - (tgl_akhir_seminggu.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);

        const namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        let result = '';

        if (tgl_db_format == tgl_sekarang_format) {
            result = 'Hari Ini';
        } else if (tgl_db_format == tgl_kemarin_format) {
            result = 'Kemarin';
        } else if (tgl_db_format <= tgl_awal_seminggu_format && tgl_db_format >= tgl_akhir_seminggu_format) {
            result = namaHari[tgl_db.getDay()];
        } else {
            result = tgl_db.toLocaleDateString("id-ID");
        }

        return result;
    }

    useEffect(() => {
        setUnsubscribeUsers(() => getDataUsers());
        setUnsubscribeMessages(() => getDataMessages());

        return () => {
            unsubscribe();
            console.log('terhapus');
        }
    }, []);

    return (
        <>
            <div className='chat-container back-image'>
                <div className='card shadow-custom w-100'>
                    <div className='card-body rounded text-center p-2 p-md-3'>
                        <h1 className='fw-bold text-teal font-salsa mb-0' style={{ fontSize: '3em' }}>GroupChat</h1>
                    </div>
                </div>

                <div className='row mt-2 mt-md-3 w-100'>
                    <div className='col-md-3 ps-0 pe-0 pe-md-2'>
                        {/* DESKTOP */}
                        <div className='card shadow-custom w-100 d-none d-md-block'>
                            <div className='card-body text-center'>
                                <div style={{ width: '120px', margin: 'auto' }}>
                                    <img src={props.user.photo} alt={props.user.name + '-' + props.user.gender} className='rounded-circle w-100 mb-3' />
                                </div>
                                <h5>{props.user.name}</h5>
                                <h6>({props.user.gender})</h6>
                                <div className='mt-3'>
                                    <button className='btn btn-sm bg-teal text-white' onClick={handleButtonLogoutClick}>Keluar <Icon icon={ILogout} width={'25px'} /></button>
                                </div>
                                <div className='mt-3 d-none'>
                                    <button className='btn btn-sm btn-warning' onClick={unsubscribe}>Unsubscribe</button>
                                </div>
                            </div>
                        </div>
                        {/* MOBILE */}
                        <div className='card shadow-custom w-100 d-block d-md-none'>
                            <div className='card-body p-3'>
                                <div className='d-flex justify-content-between'>
                                    <div style={{ width: '100px' }}>
                                        <img src={props.user.photo} alt={props.user.name + '-' + props.user.gender} className='rounded-circle w-100' />
                                    </div>
                                    <div className='p-2 w-100'>
                                        <h6 className='mb-0'>{props.user.name}</h6>
                                        <small>({props.user.gender})</small>
                                    </div>
                                    <div className='text-end m-auto'>
                                        <button className='btn btn-sm bg-teal text-white' onClick={handleButtonLogoutClick}><Icon icon={ILogout} width={'25px'} /></button>
                                        <button className='btn btn-sm btn-warning mt-2 d-none' onClick={unsubscribe}>Unsubscribe</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-9 mt-2 mt-md-0 pe-0 ps-0 ps-md-2 chat-col'>
                        <div className='card shadow-custom w-100 h-100'>
                            <div className='card-body chat-card p-3'>
                                <div className='chat-messages'>
                                    {
                                        messages.map((val, idx, arr) => {
                                            const user_chat = users.find(o => o.id === val.senderID);
                                            const next_senderID = idx < arr.length - 1 ? arr[idx + 1].senderID : null;
                                            const next_date = idx < arr.length - 1 ? arr[idx + 1].timestamp.seconds : null;

                                            // set penanda tanggal hari sebelum
                                            const tgl_db = new Date(val.timestamp.seconds * 1000);
                                            const tgl_db_id = tgl_db.toLocaleDateString("id-ID");
                                            const tgl_next = next_date === null ? '' : new Date(next_date * 1000).toLocaleDateString("id-ID");
                                            let tgl_next_el = '';
                                            if (tgl_db_id !== tgl_next) {
                                                tgl_next_el = convertDatePrevious(tgl_db)
                                            }

                                            return (
                                                <BubbleChat key={val.id} chat={val} userID={props.user.id} userChat={user_chat} next_senderID={next_senderID} tgl_next_el={tgl_next_el} />
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='card shadow-custom mt-2'>
                            <div className='card-body'>
                                <InputChat user={props.user} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChatPage;