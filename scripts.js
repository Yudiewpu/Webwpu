// Fade-in effect and Navbar scroll effect
document.addEventListener('DOMContentLoaded', function() {
    const fadeElements = document.querySelectorAll('.fade-in');
    const navbar = document.querySelector('.navbar');

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

    // Initialize effects on page load
    handleFadeInScroll();
    handleNavbarScroll();

    // Check effects on scroll
    window.addEventListener('scroll', function() {
        handleFadeInScroll();
        handleNavbarScroll();
    });
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

