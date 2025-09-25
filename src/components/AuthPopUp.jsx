import { useState, useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';
import { db } from '../firebase';
import { collection, addDoc, getDocs, getDoc, query, where, limit } from "firebase/firestore";
import ReactLoading from 'react-loading';
import { Icon } from '@iconify/react';
import IEye from '@iconify/icons-mdi/eye';
import IEyeOff from '@iconify/icons-mdi/eye-off';
import bcrypt from 'bcryptjs';
import Swal from 'sweetalert2';

import NoPhoto from '../assets/images/no-photo.jpg';
import PhotoCowo1 from '../assets/images/photo-cowo-1.jpg';
import PhotoCowo2 from '../assets/images/photo-cowo-2.jpg';
import PhotoCowo3 from '../assets/images/photo-cowo-3.jpg';
import PhotoCowo4 from '../assets/images/photo-cowo-4.jpg';
import PhotoCewe1 from '../assets/images/photo-cewe-1.jpg';
import PhotoCewe2 from '../assets/images/photo-cewe-2.jpg';
import PhotoCewe3 from '../assets/images/photo-cewe-3.jpg';
import PhotoCewe4 from '../assets/images/photo-cewe-4.jpg';

function AuthPopUp(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [avatar, setAvatar] = useState({ photo: NoPhoto, type: '' });
    const [gender, setGender] = useState('');
    const [name, setName] = useState('');
    const [typeCard, setTypeCard] = useState('login');
    const [isShowRegister, setIsShowRegister] = useState(false);
    const [isLoadingButton, setIsLoadingButton] = useState(false);
    const modal_register_ref = useRef();
    const isMounted = useRef(false);
    const [alertBorder, setAlertBorder] = useState({ name: '', status: false });

    const handleChangeTypeCard = () => {
        setUsername('');
        setPassword('');
        setIsShowPassword(false);
        setAvatar({ photo: NoPhoto, type: '' });
        setGender('');
        setName('');
        setIsShowRegister(false);
        setIsLoadingButton(false);
        setTypeCard((prev_value) => {
            return prev_value === 'login' ? 'register' : 'login';
        });
    }
    const showSwalValidation = (name, text) => {
        Swal.fire({
            position: 'top',
            showConfirmButton: false,
            showCloseButton: true,
            toast: true,
            timer: 3000,
            timerProgressBar: true,
            icon: 'warning',
            text: text,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
        setAlertBorder({ name: name, status: true });
        setIsLoadingButton(false);
    }
    const showSwalSuccess = (text) => {
        Swal.fire({
            position: 'top',
            showConfirmButton: false,
            showCloseButton: true,
            toast: true,
            icon: 'success',
            text: text,
            timer: 3000,
        });
    }

    /* LOGIN */
    const handleInputUsernameChange = (e) => {
        setUsername(e.target.value);
        setAlertBorder({ name: '', status: false });
        e.target.classList.remove('is-invalid');
    }
    const handleInputPasswordChange = (e) => {
        setPassword(e.target.value);
        setAlertBorder({ name: '', status: false });
        e.target.classList.remove('is-invalid');
    }
    const handleButtonEyeClick = () => { setIsShowPassword(prev_value => !prev_value) }
    const handleSubmitLoginClick = async (e) => {
        e.preventDefault();
        setIsLoadingButton(true);
        if (!username.trim()) {
            showSwalValidation('username', 'Masukkan Username kamu!');
            return false;
        }
        if (!password) {
            showSwalValidation('password', 'Masukkan Password kamu!');
            return false;
        }

        const collection_users = collection(db, 'group_chat_users');
        const query_users = query(collection_users, where('username', '==', username), limit(1));
        const query_snapshot = await getDocs(query_users);

        if (query_snapshot.empty) {
            showSwalValidation('username', 'Username tidak ditemukan!');
            return false;
        }

        const doc_ref = query_snapshot.docs[0].ref;
        const doc_snapshot = await getDoc(doc_ref);
        const data = doc_snapshot.data();
        const password_match = await bcrypt.compare(password, data.password);

        if (!password_match) {
            showSwalValidation('password', 'Password tidak cocok!');
            return false;
        }

        showSwalSuccess('Berhasil masuk!');
        setTimeout(() => {
            props.onLogin({
                name: data.name,
                photo: window.location.origin + data.photo,
                gender: data.gender,
                id: doc_snapshot.id
            });

            const modal_el = modal_register_ref.current;
            const bs_modal = Modal.getInstance(modal_el)
            bs_modal.hide();
        }, 1500);
    }

    /* REGISTER */
    const handleSubmitCheckUserClick = async (e) => {
        e.preventDefault();
        setIsLoadingButton(true);
        if (!username.trim()) {
            showSwalValidation('username_check', 'Masukkan Username kamu!');
            return false;
        }

        const collection_users = collection(db, 'group_chat_users');
        const query_users = query(collection_users, where('username', '==', username), limit(1));
        const query_snapshot = await getDocs(query_users);

        if (!query_snapshot.empty) {
            showSwalValidation('username_check', 'Username sudah dipakai!');
            return false;
        }

        showSwalSuccess('Username dapat dipakai!');
        setTimeout(() => {
            setIsShowRegister(true);
            setIsLoadingButton(false);
        }, 1500);
    }
    const hashPassword = async () => {
        const salt_rounds = 10;
        const salt = await bcrypt.genSalt(salt_rounds);
        const hashed = await bcrypt.hash(password, salt);
        return hashed;
    };
    const handleRadioAvatarChange = (e) => {
        if (!gender) {
            showSwalValidation('gender', 'Pilih gender dulu!');
            e.target.checked = false;
            return false;
        }

        const value_radio = e.target.value;
        switch (value_radio) {
            case 'type_1':
                setAvatar({
                    photo: gender === 'Cowo' ? PhotoCowo1 : PhotoCewe1,
                    type: value_radio,
                });
                break;
            case 'type_2':
                setAvatar({
                    photo: gender === 'Cowo' ? PhotoCowo2 : PhotoCewe2,
                    type: value_radio,
                });
                break;
            case 'type_3':
                setAvatar({
                    photo: gender === 'Cowo' ? PhotoCowo3 : PhotoCewe3,
                    type: value_radio,
                });
                break;
            case 'type_4':
                setAvatar({
                    photo: gender === 'Cowo' ? PhotoCowo4 : PhotoCewe4,
                    type: value_radio,
                });
                break;

            default:
                break;
        }
    };
    const handleSelectGenderChange = (e) => {
        setGender(e.target.value);
        const radio_avatars = document.querySelectorAll('.radio-avatar');
        radio_avatars.forEach(element => {
            element.checked = false;
            setAvatar({ photo: NoPhoto, type: '' });
        });
        setAlertBorder({ name: '', status: false });
        e.target.classList.remove('is-invalid');
    }
    const handleInputNameChange = (e) => {
        setName(e.target.value);
        setAlertBorder({ name: '', status: false });
        e.target.classList.remove('is-invalid');
    }
    const handleSubmitRegisterClick = async (e) => {
        e.preventDefault();
        setIsLoadingButton(true);
        if (!password) {
            showSwalValidation('password_new', 'Masukkan password kamu!');
            return false;
        }
        if (!name.trim()) {
            showSwalValidation('name', 'Masukkan Nama kamu!');
            return false;
        }
        if (!gender) {
            showSwalValidation('gender', 'Masukkan Gender kamu!');
            return false;
        }

        const hashed_password = await hashPassword();
        const data_user = {
            username: username,
            password: hashed_password,
            name: name,
            photo: avatar.photo,
            gender: gender,
        };

        const collection_users = collection(db, 'group_chat_users');
        const doc_user = await addDoc(collection_users, data_user);

        if (!doc_user.id) {
            Swal.fire({
                position: 'top',
                showConfirmButton: false,
                showCloseButton: true,
                toast: true,
                icon: 'error',
                text: 'Koneksi bermasalah!'
            });
            setIsLoadingButton(false);
            return false;
        }

        showSwalSuccess('Pendaftaran akun berhasil!');
        setTimeout(() => {
            handleChangeTypeCard();
        }, 1500);
    }

    useEffect(() => {
        // Buat tidak doubel modal saat pertama kali dimount
        if (!isMounted.current) {
            const modal_el = modal_register_ref.current;
            const bs_modal = new Modal(modal_el, {
                backdrop: 'static',
                keyboard: false
            });
            bs_modal.show();
            isMounted.current = true;
        }
    }, []);
    // Jika ada alert dibuat auto focus ke input yg salah
    useEffect(() => {
        if (alertBorder.status) {
            document.getElementById(alertBorder.name).focus();
        }
    }, [alertBorder]);

    return (
        <>
            <div className='modal fade' ref={modal_register_ref} tabIndex='-1'>
                <div className='modal-dialog modal-dialog-centered'>
                    <div className='modal-content shadow-custom'>
                        <div className='modal-body'>

                            <div className={`animate-div ${typeCard === 'login' ? 'show' : 'hidden'}`}>
                                <h4 className='mb-0'>Masuk</h4>
                                <small>Masuk untuk memulai GroupChat</small>
                                <form onSubmit={handleSubmitLoginClick}>
                                    <div className='my-3'>
                                        <label htmlFor='username' className='form-label'>Username</label>
                                        <input type='text' id='username' className={`form-control ${alertBorder.name == 'username' && alertBorder.status ? 'is-invalid' : ''}`} placeholder='Username kamu' value={username} onChange={handleInputUsernameChange} />
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor='password' className='form-label'>Password</label>
                                        <div className='input-group'>
                                            <input type={isShowPassword ? 'text' : 'password'} id='password' className={`form-control ${alertBorder.name == 'password' && alertBorder.status ? 'is-invalid' : ''}`} placeholder='Password kamu' value={password} onChange={handleInputPasswordChange} />
                                            <span className='input-group-text' style={{ cursor: 'pointer' }} onClick={handleButtonEyeClick}>
                                                <Icon icon={isShowPassword ? IEye : IEyeOff} width={'25px'} />
                                            </span>
                                        </div>
                                    </div>
                                    <button type='submit' className='btn bg-teal text-white w-100' disabled={isLoadingButton}>
                                        {
                                            isLoadingButton ? (
                                                <ReactLoading type='spinningBubbles' height='25px' width='25px' className='m-auto' />
                                            ) : (
                                                'Masuk'
                                            )
                                        }
                                    </button>
                                </form>
                                <div className='text-center mt-3'>
                                    <small>Belum punya Akun? <span className='link' onClick={handleChangeTypeCard}>Daftar</span></small>
                                </div>
                            </div>

                            <div className={`animate-div ${typeCard === 'register' ? 'show' : 'hidden'}`}>
                                <h4 className='mb-0'>Daftar Akun</h4>
                                <small>Buat user baru untuk memulai GroupChat</small>
                                <div className='my-3'>
                                    <div className={`animate-div ${isShowRegister ? 'hidden' : 'show'}`}>
                                        <form onSubmit={handleSubmitCheckUserClick}>
                                            <div className='mb-3'>
                                                <label htmlFor='username' className='form-label'>Username</label>
                                                <input type='text' id='username_check' value={username} className={`form-control ${alertBorder.name == 'username_check' && alertBorder.status ? 'is-invalid' : ''}`} placeholder='Username kamu' onChange={handleInputUsernameChange} />
                                            </div>
                                            <button type='submit' className='btn bg-teal text-white w-100' disabled={isLoadingButton}>
                                                {
                                                    isLoadingButton ? (
                                                        <ReactLoading type='spinningBubbles' height='25px' width='25px' className='m-auto' />
                                                    ) : (
                                                        'Cek User'
                                                    )
                                                }
                                            </button>
                                        </form>
                                        <div className='text-center mt-3'>
                                            <small>Sudah punya Akun? <span className='link' onClick={handleChangeTypeCard}>Masuk</span></small>
                                        </div>
                                    </div>
                                    <div className={`animate-div ${isShowRegister ? 'show' : 'hidden'}`}>
                                        <form onSubmit={handleSubmitRegisterClick}>
                                            <div className='mb-3'>
                                                <label htmlFor='username' className='form-label'>Username</label>
                                                <input type='text' value={username} className='form-control' disabled />
                                            </div>
                                            <div className='mb-3'>
                                                <label htmlFor='password' className='form-label'>Password</label>
                                                <div className='input-group'>
                                                    <input type={isShowPassword ? 'text' : 'password'} id="password_new" className={`form-control ${alertBorder.name == 'password_new' && alertBorder.status ? 'is-invalid' : ''}`} placeholder='Password kamu' value={password} onChange={handleInputPasswordChange} />
                                                    <span className='input-group-text' style={{ cursor: 'pointer' }} onClick={handleButtonEyeClick}>
                                                        <Icon icon={isShowPassword ? IEye : IEyeOff} width={'25px'} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div className='mb-3'>
                                                <label htmlFor='name' className='form-label'>Nama Kamu</label>
                                                <input type='text' id='name' className={`form-control ${alertBorder.name == 'name' && alertBorder.status ? 'is-invalid' : ''}`} placeholder='Masukkan nama kamu' value={name} onChange={handleInputNameChange} />
                                            </div>
                                            <div className='mb-3'>
                                                <label htmlFor='gender' className='form-label'>Gender Kamu</label>
                                                <select id='gender' className={`form-select ${alertBorder.name == 'gender' && alertBorder.status ? 'is-invalid' : ''}`} value={gender} onChange={handleSelectGenderChange}>
                                                    <option value=''>Pilih Gender Kamu</option>
                                                    <option value='Cowo'>Cowo</option>
                                                    <option value='Cewe'>Cewe</option>
                                                </select>
                                            </div>
                                            <label htmlFor='avatar' className='form-label'>Avatar</label>
                                            <div className='d-flex justify-content-center'>
                                                <div style={{
                                                    width: '200px',
                                                    padding: '10px',
                                                    textAlign: 'center'
                                                }}>
                                                    <img src={avatar.photo} alt='photo-profile' className='rounded-circle w-100' />
                                                </div>
                                                <div className='btn-group-vertical text-center ms-3 mb-3' role='group' aria-label='Radio Button Group'>
                                                    <input type='radio' className='btn-check radio-avatar' name='avatar' value='type_1' id='type_1' autoComplete='off' onChange={handleRadioAvatarChange} />
                                                    <label className='btn btn-outline-primary' htmlFor='type_1'>Type 1</label>

                                                    <input type='radio' className='btn-check radio-avatar' name='avatar' value='type_2' id='type_2' autoComplete='off' onChange={handleRadioAvatarChange} />
                                                    <label className='btn btn-outline-primary' htmlFor='type_2'>Type 2</label>

                                                    <input type='radio' className='btn-check radio-avatar' name='avatar' value='type_3' id='type_3' autoComplete='off' onChange={handleRadioAvatarChange} />
                                                    <label className='btn btn-outline-primary' htmlFor='type_3'>Type 3</label>

                                                    <input type='radio' className='btn-check radio-avatar' name='avatar' value='type_4' id='type_4' autoComplete='off' onChange={handleRadioAvatarChange} />
                                                    <label className='btn btn-outline-primary' htmlFor='type_4'>Type 4</label>
                                                </div>
                                            </div>
                                            <button type='submit' className='btn bg-teal text-white w-100' disabled={isLoadingButton}>
                                                {
                                                    isLoadingButton ? (
                                                        <ReactLoading type='spinningBubbles' height='25px' width='25px' className='m-auto' />
                                                    ) : (
                                                        'Daftar'
                                                    )
                                                }
                                            </button>
                                        </form>
                                        <div className='text-center mt-3'>
                                            <small>Sudah punya Akun? <span className='link' onClick={handleChangeTypeCard}>Masuk</span></small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AuthPopUp;