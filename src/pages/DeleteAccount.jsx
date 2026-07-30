import Header from "../components/Header";

import "../styles/main.css";

const NAV_LINKS = [
  { label: "About", href: "/about/" },
  { label: "Docs", href: "/docs/" },
];

export default function DeleteAccount() {
  return (
    <>
      <Header navLinks={NAV_LINKS} startDark />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div className="container delete-account">
          <div className="logo">
            <img
              src="/assets/img/wsh-white.png"
              alt="WSH Logo"
              style={{ width: "100px", marginBottom: "20px" }}
            />
          </div>

          <h1>Delete Your Account</h1>
          <p style={{ textAlign: "center", color: "#888", marginBottom: "30px" }}>
            We're sorry to see you go
          </p>

          <h2>What Gets Deleted</h2>
          <p>When you delete your WSH Network account, you have two options:</p>
          <h3>Option 1: Delete All Data</h3>
          <ul>
            <li>Your profile information (name, email, photo)</li>
            <li>Your posts and comments</li>
            <li>All your account data and preferences</li>
          </ul>
          <h3>Option 2: Delete only personal data.</h3>
          <ul>
            <li>Your profile information (name, email, photo) is deleted</li>
            <li>
              Your posts and comments are anonymized (the contents still exist, but your identity is
              removed)
            </li>
            <li>All your account data and preferences are deleted</li>
          </ul>

          <div className="warning">
            <p>
              <strong>⚠️ Warning:</strong> This action cannot be undone. Once your account is deleted, all
              your data will be permanently removed from our servers.
            </p>
          </div>

          <h2>How to Delete Your Account</h2>
          <h3>In App:</h3>
          <ol>
            <li>Sign into your account in the WSH Network app</li>
            <li>
              Go to <strong>Profile → Settings → Account</strong>
            </li>
            <li>Select one of the deletion options at the bottom of the menu</li>
            <li>Follow the directions provided</li>
            <li>Confirm your choice to delete your account and wait ~30 seconds</li>
          </ol>

          <h3>
            If you prefer to delete your account via email, please provide the following information in an
            email to contact@wshnetwork.com:
          </h3>
          <ul>
            <li>
              <strong>Email address</strong> associated with your account
            </li>
            <li>
              <strong>Name of your school</strong>
            </li>
            <li>Brief reason for deletion (optional)</li>
          </ul>

          <div className="contact-box">
            <h3>Contact Support</h3>
            <p style={{ color: "#AAA" }}>Send your deletion request to:</p>
            <p className="email-text">contact@wshnetwork.com</p>
            <a
              href="mailto:contact@wshnetwork.com?subject=Account%20Deletion%20Request&body=Email:%0D%0AFull%20Name:%0D%0ASchool%20ID:%0D%0AReason%20(optional):%0D%0A"
              className="email-link"
            >
              Send Deletion Request
            </a>
          </div>

          <h2>Processing Time</h2>
          <p>
            Account deletion email requests are typically processed within{" "}
            <strong>3-5 business days</strong>. You will receive a confirmation email once your account has
            been deleted.
          </p>

          <h2>Alternative: Deactivate Instead</h2>
          <p>
            If you're not ready to permanently delete your account, you can deactivate it temporarily from
            within the app. Go to <strong>Settings → Account → Deactivate Account</strong>.
          </p>

          <p style={{ textAlign: "center", marginTop: "40px", color: "#666", fontSize: "14px" }}>
            Need help? Contact us at contact@wshnetwork.com
          </p>
        </div>
      </div>
    </>
  );
}
