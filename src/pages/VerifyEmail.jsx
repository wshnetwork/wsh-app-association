import { useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, applyActionCode } from "firebase/auth";

import "../styles/main.css";

const firebaseConfig = {
  apiKey: "AIzaSyA86nJPGQOOTM0U-eHuhqnTi0O9EpdmX0A",
  authDomain: "wesh-3ae30.firebaseapp.com",
  projectId: "wesh-3ae30",
};

export default function VerifyEmail() {
  const titleRef = useRef(null);
  const spinnerRef = useRef(null);
  const messageRef = useRef(null);
  const actionRef = useRef(null);
  const verifyBtnRef = useRef(null);

  useEffect(() => {
    // Faithful port of the original inline <script type="module"> in
    // verify_email/index.html. This is a one-shot linear flow (click ->
    // verify -> success/error), kept as direct imperative DOM
    // manipulation via refs rather than rewritten as React state.
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get("mode");
    const oobCode = urlParams.get("oobCode");
    const spinner = spinnerRef.current;
    const title = titleRef.current;
    const message = messageRef.current;
    const action = actionRef.current;
    const verifyBtn = verifyBtnRef.current;
    let schoolId = "";
    try {
      const continueUrl = urlParams.get("continueUrl");
      console.log("Continue URL:", continueUrl);

      if (continueUrl) {
        // Parse the continueUrl
        const continueUrlObj = new URL(continueUrl);

        // First try to get schoolId directly from continueUrl
        let extractedSchoolId = new URLSearchParams(continueUrlObj.search).get("schoolId");

        // If not found, it might be nested in the 'link' parameter
        if (!extractedSchoolId) {
          const nestedLink = new URLSearchParams(continueUrlObj.search).get("link");
          console.log("Nested link:", nestedLink);

          if (nestedLink) {
            try {
              const nestedLinkObj = new URL(nestedLink);
              extractedSchoolId = new URLSearchParams(nestedLinkObj.search).get("schoolId");
              console.log("SchoolId from nested link:", extractedSchoolId);
            } catch (e) {
              console.error("Error parsing nested link:", e);
            }
          }
        }

        schoolId = extractedSchoolId || "";
        console.log("Final schoolId:", schoolId);
      }
    } catch (error) {
      console.error("Error parsing continueUrl:", error);
    }

    spinner.style.display = "none";

    function handleVerifyClick() {
      action.innerHTML = "";
      verifyBtn.style.display = "none";

      if (mode !== "verifyEmail" || !oobCode) {
        spinner.style.display = "none";
        message.textContent = "Invalid verification link";
        action.innerHTML = '<a href="weshapp://" class="button">Return to App</a>';
        return;
      }

      spinner.style.display = "block";
      message.textContent = "Verifying your email...";

      applyActionCode(auth, oobCode)
        .then(() => {
          spinner.style.display = "none";
          title.innerHTML = '<span class="success">✓</span>';
          message.textContent = "Email verified successfully!";

          setTimeout(() => {
            window.location.href = "weshapp://main?action=verification_success&schoolId=" + schoolId;
          }, 2000);

          setTimeout(() => {
            action.innerHTML =
              '<a href="weshapp://main?action=verification_success&schoolId=' +
              schoolId +
              '" class="button">Open App</a>';
          }, 3000);
        })
        .catch((error) => {
          spinner.style.display = "none";
          verifyBtn.style.display = "none";
          title.innerHTML = '<span class="error">✗</span>';
          message.textContent = "Verification failed: " + error.message;
          action.innerHTML =
            '<a href="weshapp://main?action=verification_failed&schoolId=' +
            schoolId +
            '" class="button">Return to App</a>';
        });
    }

    verifyBtn.addEventListener("click", handleVerifyClick);
    return () => {
      verifyBtn.removeEventListener("click", handleVerifyClick);
    };
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <div className="container verify-email">
        <img src="/assets/img/wsh-white.png" alt="WSH Logo" style={{ width: "100px", marginBottom: "20px" }} />
        <h1 id="title" ref={titleRef}>
          Email Verification
        </h1>
        <button id="verifyBtn" className="button" ref={verifyBtnRef}>
          Verify Email
        </button>
        <div className="spinner" id="spinner" ref={spinnerRef}></div>
        <p id="message" ref={messageRef}>
          Click the button to verify your email.
        </p>

        <div id="action" ref={actionRef}></div>
      </div>
    </div>
  );
}
