document.addEventListener('DOMContentLoaded', function() {
    const fadeElements = document.querySelectorAll('.fade-in');
    const navbar = document.querySelector('.navbar');
    const dateInput = document.getElementById('date');
    const messageInput = document.getElementById('message');
    const submitButton = document.getElementById('submitButton');
    const buttonText = document.getElementById('buttonText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const alertBox = document.getElementById('alertBox');

    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    function checkFormValidity() {
        // Enable the submit button only if the message is filled out
        submitButton.disabled = !messageInput.value.trim();
    }

    // Initialize form validation on page load
    checkFormValidity();

    function handleFadeInScroll() {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;

        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top + scrollTop;
            if (scrollTop + windowHeight > elementTop + 100) {
                element.classList.add('visible');
            }
        });
    }

    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Add event listener to the message input
    messageInput.addEventListener('input', checkFormValidity);

    // Fungsi untuk menampilkan dan menyembunyikan alert
    function showAlert() {
        alertBox.style.display = 'block';

        setTimeout(function() {
            alertBox.style.display = 'none';
        }, 3000);
    }

    // Fungsi untuk menampilkan loading animasi pada tombol submit
    function showLoading() {
        buttonText.textContent = "Sedang mengirim pesan";
        loadingSpinner.style.display = "inline-block";
        submitButton.disabled = true; // Disable the button while sending
    }

    // Fungsi untuk menyembunyikan loading animasi dan reset tombol submit
    function hideLoading() {
        buttonText.textContent = "Kirim";
        loadingSpinner.style.display = "none";
        // Re-enable the submit button only if the message input is not empty
        checkFormValidity();
    }

    // Memanggil fungsi showAlert saat formulir dikirim
    document.getElementById('feedbackForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Mencegah pengiriman formulir sebenarnya untuk demonstrasi

        if (messageInput.value.trim()) { // Double check if the form is not empty
            // Tampilkan loading animasi
            showLoading();

            const formData = new FormData();
            formData.append('tanggal', dateInput.value);
            formData.append('detail', messageInput.value);

            // Kirim data ke Google Sheets menggunakan fetch
            fetch('https://script.google.com/macros/s/AKfycbzjZDsyBmidcwN4cHSn-Xc8xtsBmL2xp_QZUfvR73RUKpBU1XR2RVsh0UE3i2GbLL8P/exec', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Cek jika data berhasil dikirim
                if (data.status === 'success') {
                    // Panggil fungsi untuk menampilkan alert
                    showAlert();

                    // Sembunyikan loading animasi dan reset tombol
                    hideLoading();

                    // Jangan reset tanggal, hanya reset pesan
                    messageInput.value = '';

                    // Check form validity after clearing the message
                    checkFormValidity();
                } else {
                    // Tampilkan pesan error jika terjadi kegagalan
                    console.error('Error:', data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                hideLoading(); // Sembunyikan loading meskipun terjadi error
            });
        } else {
            // If message is empty, ensure the submit button is disabled
            submitButton.disabled = true;
        }
    });

    // Initialize effects on page load
    handleFadeInScroll();
    handleNavbarScroll();

    // Check effects on scroll
    window.addEventListener('scroll', function() {
        handleFadeInScroll();
        handleNavbarScroll();
    });

    // Fungsi untuk format angka ke mata uang IDR
    function formatCurrencyIDR(amount) {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
    }

    // Fungsi untuk fetch data dari Google Sheets dan memperbarui financial cards
    function fetchData() {
        fetch('https://script.google.com/macros/s/AKfycbzVD5sht04smoE4-sj8NXZGSNM9RtLYYAnLcFJulTw7IL12uA6Sx7I1WVozVjmgYJT0/exec')
            .then(response => response.json())
            .then(result => {
                if (result.status === 'success') {
                    let data = result.data;

                    let totalPemasukan = 0;
                    let totalPengeluaran = 0;

                    data.forEach(row => {
                        const nominal = parseFloat(row.Nominal);
                        if (row.Category === 'Pemasukan') {
                            totalPemasukan += nominal;
                        } else if (row.Category === 'Pengeluaran') {
                            totalPengeluaran += nominal;
                        }
                    });

                    const sisaSaldo = totalPemasukan - totalPengeluaran;

                    // Memperbarui elemen HTML dengan nilai yang dihitung
                    document.getElementById('total-pemasukan').textContent = formatCurrencyIDR(totalPemasukan);
                    document.getElementById('total-pengeluaran').textContent = formatCurrencyIDR(totalPengeluaran);
                    document.getElementById('sisa-saldo').textContent = formatCurrencyIDR(sisaSaldo);

                } else {
                    console.error('Failed to retrieve data:', result.message);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Memanggil fetchData saat halaman dimuat
    fetchData();
});

