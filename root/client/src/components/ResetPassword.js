import React from 'react';

function ResetPassword() {
  return (
    <div className="form-container">
      <h2>Forgot Password</h2>
      <form>
        <input type="email" name="email" placeholder="Enter your email" required />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}

export default ResetPassword;
