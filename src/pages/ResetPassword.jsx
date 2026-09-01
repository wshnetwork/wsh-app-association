import { useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";

import "../styles/main.css";

const firebaseConfig = {
  apiKey: "AIzaSyA86nJPGQOOTM0U-eHuhqnTi0O9EpdmX0A",
  authDomain: "wesh-3ae30.firebaseapp.com",
  projectId: "wesh-3ae30",
};

export default function ResetPassword() {
  const titleRef = useRef(null);
  const spinnerRef = useRef(null);
  const messageRef = useRef(null);
  const actionRef = useRef(null);

  useEffect(() => {
    // Faithful port of the original inline <script type="module"> in
    // reset_password/index.html. This is a one-shot linear flow (verify
    // code -> show form -> submit -> success/error), so it is kept as
    // direct, imperative DOM manipulation via refs rather than rewritten
    // as React state.
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get("mode");
    const oobCode = urlParams.get("oobCode");
    const schoolId = new URLSearchParams(new URL(urlParams.get("continueUrl")).search)
      .get("schoolId")
      .toString();

    const spinner = spinnerRef.current;
    const title = titleRef.current;
    const message = messageRef.current;
    const action = actionRef.current;

    function showError(msg) {
      spinner.style.display = "none";
      title.innerHTML = '<span class="error">✗</span>';
      message.textContent = msg;
      action.innerHTML =
        '<a href="weshapp://main?action=password_reset_failed&schoolId=' +
        encodeURIComponent(schoolId || "") +
        '" class="button">Return to App</a>';
    }

    if (mode === "resetPassword" && oobCode) {
      // Verify the code first to get the user's email (optional)
      verifyPasswordResetCode(auth, oobCode)
        .then((email) => {
          spinner.style.display = "none";
          title.textContent = "Reset Password";
          message.innerHTML =
            'Set a new password for <strong style="color:#fff;">' + (email || "") + "</strong>";

          // show password form
          action.innerHTML = `
                        <div id="form">
                            <div class="form-row">
                                <label for="password">New password</label>
                                <input id="password" type="password" placeholder="At least 6 characters">
                            </div>
                            <div class="form-row">
                                <label for="confirm">Confirm password</label>
                                <input id="confirm" type="password" placeholder="Repeat new password">
                            </div>
                            <div id="err" class="error-text" style="display:none;"></div>
                            <button id="submit" class="button">Set Password</button>
                        </div>
                    `;

          const pwdInput = document.getElementById("password");
          const confInput = document.getElementById("confirm");
          const err = document.getElementById("err");
          const submit = document.getElementById("submit");

          submit.addEventListener("click", () => {
            err.style.display = "none";
            const pw = pwdInput.value || "";
            const cpw = confInput.value || "";

            if (pw.length < 6) {
              err.textContent = "Password must be at least 6 characters.";
              err.style.display = "block";
              return;
            }
            if (pw !== cpw) {
              err.textContent = "Passwords do not match.";
              err.style.display = "block";
              return;
            }

            submit.disabled = true;
            submit.textContent = "Setting...";

            confirmPasswordReset(auth, oobCode, pw)
              .then(() => {
                title.innerHTML = '<span class="success">✓</span>';
                message.textContent = "Password has been reset successfully!";
                action.innerHTML =
                  '<a href="weshapp://main?action=password_reset_success&schoolId=' +
                  encodeURIComponent(schoolId || "") +
                  '" class="button">Open App</a>';
                // Optionally redirect after short delay
                setTimeout(() => {
                  window.location.href =
                    "weshapp://main?action=password_reset_success&schoolId=" +
                    encodeURIComponent(schoolId || "");
                }, 1500);
              })
              .catch((error) => {
                submit.disabled = false;
                submit.textContent = "Set Password";
                err.textContent =
                  "Failed to reset password: " + (error.message || error.code || "unknown error");
                err.style.display = "block";
              });
          });
        })
        .catch((error) => {
          showError("Invalid or expired reset link: " + (error.message || error.code || ""));
        });
    } else {
      spinner.style.display = "none";
      message.textContent = "Invalid password reset link";
      action.innerHTML = '<a href="weshapp://main" class="button">Return to App</a>';
    }
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <div className="container reset-password">
        <img src="/assets/img/wsh-white.png" alt="WSH Logo" style={{ width: "100px", marginBottom: "20px" }} />
        <h1 id="title" ref={titleRef}>
          Reset Password
        </h1>

        <div id="spinner" className="spinner" ref={spinnerRef}></div>

        <p id="message" ref={messageRef}>
          Verifying reset link...
        </p>

        <div id="action" ref={actionRef}></div>
      </div>
    </div>
  );
}
