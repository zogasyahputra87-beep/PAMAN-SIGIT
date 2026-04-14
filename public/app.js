// --- 1. LOGIKA SIDEBAR ---
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
}

// --- 2. LOGIKA NAVIGASI (SPA) ---
function navigate(page) {
    const contentArea = document.getElementById('content-area');
    const pageTitle = document.getElementById('page-title');
    
    // Reset Active Menu
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    
    if (page === 'dashboard') {
        document.getElementById('btn-dashboard').classList.add('active');
        pageTitle.innerText = "Ringkasan Sistem";
        renderDashboard();
    } else if (page === 'buat') {
        document.getElementById('btn-buat').classList.add('active');
        pageTitle.innerText = "Buat Konsultasi Baru";
        renderForm();
    } else if (page === 'riwayat') {
        document.getElementById('btn-riwayat').classList.add('active');
        pageTitle.innerText = "Daftar Riwayat Konsultasi";
        renderRiwayat();
    }

    // Tutup sidebar jika di mobile setelah klik menu
    if (window.innerWidth < 768) toggleSidebar();
}

// --- 3. RENDER HALAMAN DASHBOARD ---
function renderDashboard() {
    const data = JSON.parse(localStorage.getItem('consultations')) || [];
    document.getElementById('content-area').innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p class="text-[11px] font-bold text-gray-400 uppercase">Total</p>
                <h3 class="text-4xl font-black text-gray-800">${data.length}</h3>
            </div>
            </div>
        <div class="bg-gray-800 text-white p-10 rounded-3xl shadow-xl">
            <h3 class="text-2xl font-bold italic">Selamat Datang, Zoga.</h3>
            <p class="mt-2 text-gray-400">Gunakan menu di samping untuk mengelola data konsultasi Inspektorat.</p>
        </div>
    `;
}

// --- 4. RENDER HALAMAN FORM ---
function renderForm() {
    document.getElementById('content-area').innerHTML = `
        <div class="bg-white p-8 rounded-2xl shadow-sm border max-w-2xl mx-auto">
            <form id="consultForm" class="space-y-4">
                <input type="text" id="opd" placeholder="Instansi" class="w-full p-3 border rounded-xl bg-gray-50" required>
                <input type="text" id="subject" placeholder="Judul Masalah" class="w-full p-3 border rounded-xl bg-gray-50" required>
                <textarea id="issue" placeholder="Rincian Masalah" class="w-full p-3 border rounded-xl bg-gray-50" rows="4" required></textarea>
                <button type="submit" class="w-full bg-gray-800 text-white py-4 rounded-xl font-bold uppercase tracking-widest">Simpan Pengajuan</button>
            </form>
        </div>
    `;

    document.getElementById('consultForm').onsubmit = (e) => {
        e.preventDefault();
        const data = JSON.parse(localStorage.getItem('consultations')) || [];
        data.push({
            opd: document.getElementById('opd').value,
            subject: document.getElementById('subject').value,
            issue: document.getElementById('issue').value,
            status: 'Menunggu',
            date: new Date().toLocaleDateString('id-ID')
        });
        localStorage.setItem('consultations', JSON.stringify(data));
        alert('Data Berhasil Disimpan!');
        navigate('riwayat');
    };
}

// --- 5. RENDER HALAMAN RIWAYAT ---
function renderRiwayat() {
    const data = JSON.parse(localStorage.getItem('consultations')) || [];
    document.getElementById('content-area').innerHTML = `
        <div class="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <table class="w-full text-left">
                <thead class="bg-gray-50 border-b text-[10px] uppercase font-bold text-gray-400">
                    <tr><th class="p-4">Instansi</th><th class="p-4">Masalah</th><th class="p-4">Aksi</th></tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    ${data.map((item, index) => `
                        <tr>
                            <td class="p-4 text-sm font-bold">${item.opd}</td>
                            <td class="p-4 text-sm">${item.subject}</td>
                            <td class="p-4"><button onclick="deleteData(${index})" class="text-red-500 text-xs">Hapus</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function deleteData(index) {
    if(confirm('Hapus data ini?')) {
        let data = JSON.parse(localStorage.getItem('consultations'));
        data.splice(index, 1);
        localStorage.setItem('consultations', JSON.stringify(data));
        renderRiwayat();
    }
}

// Jalankan Dashboard saat pertama kali buka
window.onload = () => navigate('dashboard');
