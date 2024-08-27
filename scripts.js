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
