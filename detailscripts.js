document.addEventListener('DOMContentLoaded', function() {
    const url = 'https://script.google.com/macros/s/AKfycbzVD5sht04smoE4-sj8NXZGSNM9RtLYYAnLcFJulTw7IL12uA6Sx7I1WVozVjmgYJT0/exec';

    const totalPemasukanElement = document.getElementById('total-pemasukan');
    const totalPengeluaranElement = document.getElementById('total-pengeluaran');
    const sisaSaldoElement = document.getElementById('sisa-saldo');
    const tableBodyElement = document.getElementById('financial-table-body');
    const bulanSelect = document.getElementById('bulan');
    const categorySelect = document.getElementById('category');
    const filterForm = document.getElementById('filterForm');
    const alertSection = document.getElementById('alert-section');
    const searchButton = document.getElementById('searchButton');

    // Show the alert section
    function showAlert() {
        alertSection.classList.remove('d-none');
    }

    // Hide the alert section
    function hideAlert() {
        alertSection.classList.add('d-none');
    }


    // Fetch data from the API
    function fetchData() {
        showAlert(); // Show the alert when starting to fetch data

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(json => {
                if (json.status === 'success' && Array.isArray(json.data)) {
                    filterData(json.data);
                } else {
                    console.error('Invalid data format:', json);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                hideAlert(); // Hide the alert even if there is an error
            });
    }

    // Filter and display data based on user selection
    function filterData(data) {
        const selectedBulan = bulanSelect.value;
        const selectedCategory = categorySelect.value;

        let totalPemasukan = 0;
        let totalPengeluaran = 0;

        // Clear existing table data
        tableBodyElement.innerHTML = '';

        data.forEach(item => {
            const date = new Date(item.Tanggal);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            
            const isMonthMatch = (selectedBulan === 'all' || selectedBulan == month);
            const isCategoryMatch = (selectedCategory === 'all' || selectedCategory === item.Category.toLowerCase());

            if (isMonthMatch && isCategoryMatch) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${day}-${month}-${year}</td>
                    <td>${item.Category}</td>
                    <td>${item.SubCategory || ''}</td>
                    <td class="nominal">Rp. ${parseInt(item.Nominal).toLocaleString('id-ID')}</td>
                `;

                // Apply color based on Category
                const nominalCell = row.querySelector('.nominal');
                if (item.Category === "Pemasukan") {
                    nominalCell.style.color = "blue";
                } else if (item.Category === "Pengeluaran") {
                    nominalCell.style.color = "red";
                }

                tableBodyElement.appendChild(row);

                if (item.Category.toLowerCase() === 'pemasukan') {
                    totalPemasukan += parseInt(item.Nominal);
                } else if (item.Category.toLowerCase() === 'pengeluaran') {
                    totalPengeluaran += parseInt(item.Nominal);
                }
            }
        });

        totalPemasukanElement.textContent = `Rp. ${totalPemasukan.toLocaleString('id-ID')}`;
        totalPengeluaranElement.textContent = `Rp. ${totalPengeluaran.toLocaleString('id-ID')}`;
        sisaSaldoElement.textContent = `Rp. ${(totalPemasukan - totalPengeluaran).toLocaleString('id-ID')}`;
    }

    // Event listener for filter changes
    searchButton.addEventListener('click', function() {
        fetchData();
    });

    // Initial fetch when page loads
    fetchData();
});
