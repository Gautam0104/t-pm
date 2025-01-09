const session = localStorage.getItem('sessionIs')
if (!session) {
    window.location.href = "auth-login-cover.html"
}