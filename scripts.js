document.addEventListener('DOMContentLoaded', function() {
    const fadeElements = document.querySelectorAll('.fade-in');
    const navbar = document.querySelector('.navbar');
    const dateInput = document.getElementById('date');
    const messageInput = document.getElementById('message');
    const submitButton = document.getElementById('submitButton');
    const buttonText = document.getElementById('buttonText');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    function checkFormValidity() {
        // Enable the submit button only if the message is filled out
        if (messageInput.value.trim()) {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
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
        const alertBox = document.getElementById('alertBox');
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

            // Simulasi pengiriman data dengan timeout (contoh)
            setTimeout(function() {
                // Panggil fungsi untuk menampilkan alert
                showAlert();

                // Sembunyikan loading animasi dan reset tombol
                hideLoading();

                // Jangan reset tanggal, hanya reset pesan
                messageInput.value = '';

                // Check form validity after clearing the message
                checkFormValidity();
            }, 2000); // Simulate a delay (2 seconds)
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
});

function formatCurrencyIDR(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
}

function fetchData() {
    fetch('https://script.google.com/macros/s/AKfycbzVD5sht04smoE4-sj8NXZGSNM9RtLYYAnLcFJulTw7IL12uA6Sx7I1WVozVjmgYJT0/exec')
        .then(response => response.json())
        .then(result => {
            console.log('Fetch Result:', result); // Debug log
            if (result.status === 'success') {
                let data = result.data;
                console.log('Fetched Data:', data); // Debug log

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

                const cardContainer = document.getElementById('card-container');

                const createCard = (title, total) => {
                    const card = document.createElement('div');
                    card.className = 'col-md-4';
                    card.innerHTML = `
                        <div class="card finance-card">
                            <div class="card-body">
                                <h5 class="card-title">${title}</h5>
                                <p class="card-text">${formatCurrencyIDR(total)}</p>
                            </div>
                        </div>
                    `;
                    console.log('Appending card:', title, total); // Debug log
                    cardContainer.appendChild(card);
                };

                createCard('Pemasukan', totalPemasukan);
                createCard('Pengeluaran', totalPengeluaran);
                createCard('Sisa Saldo', sisaSaldo);

            } else {
                console.error('Failed to retrieve data:', result.message);
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

fetchData();
