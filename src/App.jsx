import { useState, useEffect, useRef } from 'react';
import './App.css';
import AuthPopUp from './components/AuthPopUp';
import ChatPage from './ChatPage';
import ReactLoading from 'react-loading';

function App() {
	const checkUserLocalStorage = () => {
		const stored_data = localStorage.getItem(user_key);
		return stored_data ? JSON.parse(stored_data) : empty_user_obj;
	}

	const empty_user_obj = { name: '', gender: '', photo: '', id: '' };
	const user_key = 'user';
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState(checkUserLocalStorage);

	const handleLogin = (new_user) => {
		setIsLoading(true);
		setUser(new_user);
		localStorage.setItem(user_key, JSON.stringify(new_user));
	}
	const handleRemoveUser = () => {
		setIsLoading(true);
		localStorage.removeItem(user_key);
		setUser(empty_user_obj);
	}

	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	}, [isLoading]);

	return (
		<>
			{
				isLoading ? (
					<div className='loading-block d-flex' style={{
						height: '100vh',
						alignItems: 'center',
						justifyContent: 'center'
					}}>
						<ReactLoading type='spinningBubbles' height='10%' width='10%' color="#000" />
					</div>
				) : (
					user.id ? (
						<ChatPage user={user} onRemoveUser={handleRemoveUser} />
					) : (
						<>
							<AuthPopUp onLogin={handleLogin} />
							<div className='back-container back-image'></div>
						</>
					)
				)
			}
		</>
	)
}

export default App