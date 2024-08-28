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
        // Enable the submit button only if the message is filled out
        if (messageInput.value.trim()) {
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
        submitButton.disabled = false;
    }

    // Memanggil fungsi showAlert saat formulir dikirim
    document.getElementById('feedbackForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Mencegah pengiriman formulir sebenarnya untuk demonstrasi

        // Tampilkan loading animasi
        showLoading();

        // Simulasi pengiriman data dengan timeout (contoh)
        setTimeout(function() {
            // Panggil fungsi untuk menampilkan alert
            showAlert();

            // Sembunyikan loading animasi dan reset tombol
            hideLoading();

            // Mengosongkan formulir setelah data berhasil dikirim
            document.getElementById('feedbackForm').reset(); // Mengosongkan field formulir
        }, 2000); // Simulate a delay (2 seconds)
    });
});
