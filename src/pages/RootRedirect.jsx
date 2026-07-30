// Faithful port of the original public/index.html inline redirect script.
// Runs before React even needs to mount anything meaningful — this page
// never actually renders a stable UI, it just forwards the visitor.
const params = new URLSearchParams(window.location.search);
const mode = params.get("mode");

if (mode === "resetPassword") {
  window.location.replace("/reset_password/" + window.location.search);
} else if (mode === "verifyEmail") {
  window.location.replace("/verify_email/" + window.location.search);
} else {
  window.location.replace("/about/");
}

export default function RootRedirect() {
  return <h1>WSH Network</h1>;
}
