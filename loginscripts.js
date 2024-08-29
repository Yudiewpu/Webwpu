document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var loginButton = document.querySelector('.btn-loading');

    // Add loading state to button
    loginButton.classList.add('loading');
    
    fetch('https://script.google.com/macros/s/AKfycbzdTIjG4lE4ARKXyb1rOLdyJaYSSztRu_e2v8q5mEV9XLUJ7yJ_7fAj3lg8ee2MTV6C4A/exec', { // Ganti dengan URL Web App Anda
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password)
    })
    .then(response => response.json())
    .then(data => {
        loginButton.classList.remove('loading');

        if (data.status === 'success') {
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('loginTime', Date.now()); // Simpan waktu login sebagai timestamp
            // URL terenkripsi (form.html dienkripsi dengan Base64)
            var encryptedUrl = "Zm9ybS5odG1s";

            // Dekripsi dan pengalihan ke halaman form
            var decodedUrl = atob(encryptedUrl);
            window.location.href = decodedUrl;
        } else {
            var alertFail = document.getElementById('alert-fail');
            alertFail.classList.remove('d-none');
            
            // Hide alert after 3 seconds
            setTimeout(function() {
                alertFail.classList.add('d-none');
            }, 3000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        loginButton.classList.remove('loading');
    });
});
