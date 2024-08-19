import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function ResetPasswordForm() {
    const { t } = useTranslation();
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        try {
            const response = await fetch(`https://advanced-web-project.onrender.com/api/user/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const result = await response.json();
            if (!response.ok)
                setErrorMessage(t(result.error));
            else {
                alert(t(result.msg));
                navigate('/login');
            }
        } catch (error) {
            setErrorMessage(t('Failed to reset password'));
        }
    };

    return (
        <div className="container">
            <h2>{t('Reset Password')}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    name="password"
                    placeholder={t('New Password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder={t('Confirm Password')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">{t('Reset Password')}</button>
                <div className="confirmation">
                    {errorMessage && <p>{t(errorMessage)}</p>}
                </div>
            </form>
        </div>
    );
}

export default ResetPasswordForm;
