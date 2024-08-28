document.addEventListener('DOMContentLoaded', function() {
    const fadeElements = document.querySelectorAll('.fade-in');
    const navbar = document.querySelector('.navbar');
    const dateInput = document.getElementById('date');
    const messageInput = document.getElementById('message');
    const submitButton = document.querySelector('button[type="submit"]');

    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    // Disable submit button initially
    submitButton.disabled = true;

    function handleFadeInScroll() {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;

        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top + scrollTop;
            if (scrollTop + windowHeight > elementTop + 100) { // Adjust the offset as needed
                element.classList.add('visible');
            }
        });
    }

    function handleNavbarScroll() {
        if (window.scrollY > 50) { // Adjust the scroll position as needed
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    function checkFormValidity() {
        // Enable the submit button only if both date and message are filled out
        if (dateInput.value && messageInput.value.trim()) {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    }

    // Check form validity on page load
    checkFormValidity();

    // Initialize effects on page load
    handleFadeInScroll();
    handleNavbarScroll();

    // Check effects on scroll
    window.addEventListener('scroll', function() {
        handleFadeInScroll();
        handleNavbarScroll();
    });

    // Add event listeners to form fields
    dateInput.addEventListener('input', checkFormValidity);
    messageInput.addEventListener('input', checkFormValidity);
});

// Fungsi untuk menampilkan dan menyembunyikan alert
function showAlert() {
    // Menampilkan alert
    const alertBox = document.getElementById('alertBox');
    alertBox.style.display = 'block';

    // Mengatur timeout untuk menyembunyikan alert setelah 3 detik
    setTimeout(function() {
        alertBox.style.display = 'none';
    }, 3000); // 3000 milidetik = 3 detik
}

// Memanggil fungsi showAlert saat formulir dikirim
document.getElementById('feedbackForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Mencegah pengiriman formulir sebenarnya untuk demonstrasi

    // Panggil fungsi untuk menampilkan alert
    showAlert();

    // Mengosongkan formulir setelah data berhasil dikirim
    this.reset(); // Mengosongkan field formulir
    document.querySelector('button[type="submit"]').disabled = true; // Disable the submit button again
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
