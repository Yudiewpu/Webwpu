document.getElementById('dataForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Mencegah pengiriman form secara langsung

    var submitButton = document.querySelector('.btn-primary');
    submitButton.classList.add('loading'); // Tampilkan animasi loading

    // Ambil nilai dari form
    var dateInput = document.getElementById('tanggal').value;
    var categoryInput = document.getElementById('category').value;
    var detailInput = document.getElementById('detail').value;
    var nominalInput = document.getElementById('nominal').value;

    // Pastikan nilai nominal sudah diformat ulang (hapus koma)
    nominalInput = nominalInput.replace(/,/g, '');

    // Buat FormData untuk dikirim ke Google Sheets
    var formData = new FormData();
    formData.append('tanggal', dateInput);
    formData.append('category', categoryInput);
    formData.append('detail', detailInput);
    formData.append('nominal', nominalInput);

    // Kirim data ke Google Sheets menggunakan fetch
    fetch('https://script.google.com/macros/s/AKfycbzqiczUbHICrDG_y41sKDtNfA4iFJ1Wt3R6rynFykQHnosDOGsY6u2TqdCGKbi5dz8-/exec', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Cek jika data berhasil dikirim
        if (data.status === 'success') {
            showAlert('Data berhasil dikirim!', 'alert-success'); // Tampilkan alert sukses

            // Sembunyikan loading animasi
            submitButton.classList.remove('loading');

            // Reset form setelah data berhasil dikirim
            document.getElementById('dataForm').reset();
        } else {
            // Tampilkan pesan error jika terjadi kegagalan
            console.error('Error:', data.message);
            showAlert('Terjadi kesalahan dalam pengiriman data.', 'alert-danger');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('Terjadi kesalahan: ' + error.message, 'alert-danger'); // Tampilkan alert error
        submitButton.classList.remove('loading'); // Sembunyikan loading animasi meskipun terjadi error
    });
});

function showAlert(message, alertClass) {
    var alertBox = document.createElement('div');
    alertBox.className = 'alert ' + alertClass;
    alertBox.textContent = message;
    document.querySelector('#form-input').appendChild(alertBox);

    alertBox.style.display = 'block'; // Tampilkan alert

    setTimeout(function() {
        alertBox.style.display = 'none'; // Sembunyikan alert setelah beberapa detik
        alertBox.remove(); // Hapus alert dari DOM setelah sembunyi
    }, 4000); // Durasi alert ditampilkan
}

document.getElementById('nominal').addEventListener('input', function(e) {
    var value = e.target.value;
    value = value.replace(/\D/g, ''); // Hapus karakter non-digit
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Tambahkan koma untuk separator ribuan
    e.target.value = value;
});

window.addEventListener('load', function() {
    function checkSession() {
        var isLoggedIn = sessionStorage.getItem('isLoggedIn');
        var loginTime = sessionStorage.getItem('loginTime');
        var sessionDuration = 1 * 60 * 1000; // 3 menit dalam milidetik

        if (!isLoggedIn || (Date.now() - loginTime > sessionDuration)) {
            // Sesi habis atau belum login, arahkan kembali ke halaman login
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('loginTime');
            alert('Sesi telah berakhir atau Anda belum login. Silakan login kembali.');
            window.location.href = 'login.html';
        }
    }

    // Cek sesi setiap 1 detik
    setInterval(checkSession, 1000);
});
