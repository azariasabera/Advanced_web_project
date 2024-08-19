import { useState } from 'react'
import './Form.css'
import { useTranslation } from 'react-i18next'

function ResetPassword() {
    const { t } = useTranslation();
    const [responseMessage, setResponseMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            const response = await fetch('https://advanced-web-project.onrender.com/api/user/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Object.fromEntries(formData)),
            });

            const result = await response.json();
            if (!response.ok)
                setResponseMessage(result.error);
            else
                setResponseMessage(result.msg);
        } catch (error) {
            setResponseMessage('resetFail');
        }
    }

  return (
    <div className="container">
        <h2>{t('Reset Password')}</h2>
        <form action='#' onSubmit={handleSubmit}>
            <input type="email" name='email' placeholder={t('Email')} required />
            <button type="submit">{t('Reset Password')}</button>
            <div className="confirmation">
                {responseMessage && <p>{t(responseMessage)}</p>}
            </div>
        </form>
    </div>
  )
}

export default ResetPassword