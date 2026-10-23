
const initialBackups = [
    { id: 1, name: "Full System Backup", detail: "All system files and settings", type: "Full Backup", size: "18.6 GB", date: "Oct 23, 2026 · 10:32 AM", status: "Successful", icon: "fa-desktop", color: "blue" },
    { id: 2, name: "Documents Backup", detail: "Personal documents and PDFs", type: "File Backup", size: "4.2 GB", date: "Oct 23, 2026 · 08:15 AM", status: "Successful", icon: "fa-folder-open", color: "green" },
    { id: 3, name: "Project Files", detail: "Development project directory", type: "Incremental", size: "2.8 GB", date: "Oct 22, 2026 · 06:40 PM", status: "Successful", icon: "fa-code", color: "blue" },
    { id: 4, name: "Media Library", detail: "Photos, videos and audio", type: "File Backup", size: "12.4 GB", date: "Oct 22, 2026 · 02:10 PM", status: "Failed", icon: "fa-images", color: "orange" },
    { id: 5, name: "Database Snapshot", detail: "Application database snapshot", type: "Full Backup", size: "6.1 GB", date: "Oct 21, 2026 · 09:00 AM", status: "Successful", icon: "fa-database", color: "green" }
];

let backups = [...initialBackups];
let nextId = 6;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const tableBody = $("#backupTableBody");
const searchInput = $("#searchInput");
const statusFilter = $("#statusFilter");
const modalBackdrop = $("#modalBackdrop");
const backupForm = $("#backupForm");

function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type === "error" ? "error" : ""}`;

    const icon = document.createElement("i");
    icon.className = type === "error"
        ? "fa-solid fa-circle-exclamation"
        : "fa-solid fa-circle-check";

    const text = document.createElement("span");
    text.textContent = message;

    toast.append(icon, text);
    $("#toastContainer").appendChild(toast);

    window.setTimeout(() => toast.remove(), 3500);
}

function statusClass(status) {
    return "status-" + status.toLowerCase().replace(/\s+/g, "-");
}

function iconColor(color) {
    if (color === "green") return "green-file";
    if (color === "orange") return "orange-file";
    return "";
}

function renderBackups() {
    const search = searchInput.value.trim().toLowerCase();
    const filter = statusFilter.value;

    const filtered = backups.filter((backup) => {
        const matchesSearch =
            backup.name.toLowerCase().includes(search) ||
            backup.type.toLowerCase().includes(search) ||
            backup.detail.toLowerCase().includes(search);

        const matchesStatus = filter === "all" || backup.status === filter;
        return matchesSearch && matchesStatus;
    });

    tableBody.replaceChildren();

    if (filtered.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 6;
        cell.className = "empty-state";
        cell.innerHTML = '<i class="fa-regular fa-folder-open"></i>No backups match your search.';
        row.appendChild(cell);
        tableBody.appendChild(row);
    } else {
        filtered.forEach((backup) => {
            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            const nameWrap = document.createElement("div");
            nameWrap.className = "backup-name";

            const fileIcon = document.createElement("div");
            fileIcon.className = `file-icon ${iconColor(backup.color)}`;
            const icon = document.createElement("i");
            icon.className = `fa-solid ${backup.icon}`;
            fileIcon.appendChild(icon);

            const nameText = document.createElement("div");
            const name = document.createElement("strong");
            name.textContent = backup.name;
            const detail = document.createElement("small");
            detail.textContent = backup.detail;
            nameText.append(name, detail);
            nameWrap.append(fileIcon, nameText);
            nameCell.appendChild(nameWrap);

            const typeCell = document.createElement("td");
            const type = document.createElement("span");
            type.className = "type-pill";
            type.textContent = backup.type;
            typeCell.appendChild(type);

            const sizeCell = document.createElement("td");
            sizeCell.textContent = backup.size;

            const dateCell = document.createElement("td");
            dateCell.textContent = backup.date;

            const statusCell = document.createElement("td");
            const status = document.createElement("span");
            status.className = `status-pill ${statusClass(backup.status)}`;
            status.textContent = backup.status;
            statusCell.appendChild(status);

            const actionsCell = document.createElement("td");
            const actions = document.createElement("div");
            actions.className = "row-actions";

            const restoreButton = document.createElement("button");
            restoreButton.type = "button";
            restoreButton.title = "Restore backup";
            restoreButton.setAttribute("aria-label", `Restore ${backup.name}`);
            restoreButton.innerHTML = '<i class="fa-solid fa-rotate-left"></i>';
            restoreButton.addEventListener("click", () => restoreBackup(backup.id));

            const moreButton = document.createElement("button");
            moreButton.type = "button";
            moreButton.title = "View backup details";
            moreButton.setAttribute("aria-label", `Details for ${backup.name}`);
            moreButton.innerHTML = '<i class="fa-solid fa-ellipsis"></i>';
            moreButton.addEventListener("click", () => showBackupDetails(backup));

            actions.append(restoreButton, moreButton);
            actionsCell.appendChild(actions);

            row.append(nameCell, typeCell, sizeCell, dateCell, statusCell, actionsCell);
            tableBody.appendChild(row);
        });
    }

    $("#tableCount").textContent = `Showing ${filtered.length} backup${filtered.length === 1 ? "" : "s"}`;
    $("#totalBackups").textContent = backups.length;
    $("#successfulBackups").textContent =
        backups.filter((backup) => backup.status === "Successful").length;
}

function openModal() {
    backupForm.reset();
    modalBackdrop.classList.add("open");
    $("#backupName").focus();
}

function closeModal() {
    modalBackdrop.classList.remove("open");
}

function restoreBackup(id) {
    const backup = backups.find((item) => item.id === id);
    if (!backup) return;

    if (backup.status !== "Successful") {
        showToast("Only successful backups can be restored.", "error");
        return;
    }

    const confirmed = window.confirm(
        `Restore "${backup.name}"?\n\nThis is a demo. No files will actually be restored.`
    );

    if (confirmed) {
        addActivity("Restore requested", `${backup.name} · Demo operation`, "activity-blue");
        showToast(`Demo restore requested for "${backup.name}".`);
    }
}

function showBackupDetails(backup) {
    window.alert(
        `BACKUP DETAILS\n\nName: ${backup.name}\nType: ${backup.type}\nSize: ${backup.size}\nDate: ${backup.date}\nStatus: ${backup.status}\n\nDestination: Demo storage\n\nThis project uses sample data in your browser.`
    );
}

function addActivity(title, description, color = "activity-green") {
    const item = document.createElement("div");
    item.className = "activity-item";

    const iconBox = document.createElement("div");
    iconBox.className = `activity-icon ${color}`;

    const icon = document.createElement("i");
    icon.className = color === "activity-blue"
        ? "fa-solid fa-cloud-arrow-up"
        : "fa-solid fa-check";
    iconBox.appendChild(icon);

    const content = document.createElement("div");
    const heading = document.createElement("strong");
    heading.textContent = title;
    const detail = document.createElement("p");
    detail.textContent = description;
    content.append(heading, detail);

    const time = document.createElement("span");
    time.className = "activity-time";
    time.textContent = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    item.append(iconBox, content, time);
    $("#activityList").prepend(item);
}

backupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = $("#backupName").value.trim();
    if (!name) {
        showToast("Please enter a backup name.", "error");
        return;
    }

    const type = $("#backupType").value;
    const destination = $("#backupDestination").value;

    const newBackup = {
        id: nextId++,
        name,
        detail: destination + " · Newly created demo backup",
        type,
        size: "0.0 GB",
        date: new Date().toLocaleString("en-IN", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        }),
        status: "In Progress",
        icon: type.includes("System") ? "fa-desktop" :
              type.includes("File") ? "fa-folder-open" : "fa-box-archive",
        color: "blue"
    };

    backups.unshift(newBackup);
    renderBackups();
    addActivity("Backup task created", `${name} · ${type}`, "activity-blue");
    closeModal();
    showToast(`"${name}" was added to the demo backup list.`);

    // Simulate a backup completing after a short delay.
    window.setTimeout(() => {
        const task = backups.find((item) => item.id === newBackup.id);
        if (task) {
            task.status = "Successful";
            task.size = "1.2 GB";
            renderBackups();
            addActivity("Backup completed", `${name} · Demo simulation`);
            showToast(`Demo backup "${name}" completed.`);
        }
    }, 4000);
});

$("#createBackupBtn").addEventListener("click", openModal);
$("#closeModalBtn").addEventListener("click", closeModal);
$("#cancelModalBtn").addEventListener("click", closeModal);

modalBackdrop.addEventListener("click", (event) => {
    if (event.target === modalBackdrop) closeModal();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
});

searchInput.addEventListener("input", renderBackups);
statusFilter.addEventListener("change", renderBackups);

$("#refreshBtn").addEventListener("click", () => {
    renderBackups();
    showToast("Dashboard refreshed successfully.");
});

$("#exportBtn").addEventListener("click", () => {
    const headers = ["Name", "Description", "Type", "Size", "Date", "Status"];
    const rows = backups.map((backup) => [
        backup.name, backup.detail, backup.type,
        backup.size, backup.date, backup.status
    ]);

    const csvCell = (value) => `"${String(value).replace(/"/g, '""')}"`;
    const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "backupvault-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("Backup report exported as CSV.");
});

$("#scheduleBtn").addEventListener("click", () => {
    showToast("Daily schedule: 02:00 AM. Schedule editing is demo-only.");
});

$("#securityBtn").addEventListener("click", () => {
    window.alert(
        "SECURITY REPORT\n\nEncryption: Enabled (demo)\nBackup integrity: Verified (sample data)\nRecovery points: Available (demo)\nSecurity score: 98/100\n\nThis is a demonstration dashboard, not a real security audit."
    );
});

$("#helpBtn").addEventListener("click", () => {
    window.alert(
        "BACKUPVAULT HELP\n\n1. Click Create Backup to add a sample backup.\n2. Search or filter the backup table.\n3. Use the restore icon to simulate recovery.\n4. Click Export to download a CSV report.\n\nNo real files are uploaded or restored."
    );
});

$("#notificationBtn").addEventListener("click", () => {
    showToast("You're all caught up. No new notifications.");
});

$("#profileBtn").addEventListener("click", () => {
    showToast("Signed in as Dhilip · Demo administrator.");
});

$("#storageMoreBtn").addEventListener("click", () => {
    showToast("Storage capacity: 68.4 GB of 100 GB used.");
});

$("#viewActivityBtn").addEventListener("click", () => {
    document.querySelector(".activity-panel").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
    showToast("Showing recent workspace activity.");
});

$("#nextPageBtn").addEventListener("click", () => {
    showToast("All demo backups are shown on this page.");
});

$$("[data-section]").forEach((element) => {
    element.addEventListener("click", (event) => {
        const section = element.dataset.section;
        const navLink = element.classList.contains("nav-link");

        if (navLink) event.preventDefault();

        $$(".nav-link").forEach((link) => {
            link.classList.toggle("active", link.dataset.section === section);
        });

        const sectionNames = {
            dashboard: "Dashboard",
            backups: "My Backups",
            history: "Backup History",
            storage: "Storage Manager",
            recovery: "Recovery Center",
            schedule: "Backup Schedule",
            security: "Security",
            settings: "Settings"
        };

        const sectionName = sectionNames[section] || "Dashboard";
        $("#breadcrumbTitle").textContent = sectionName;
        $("#pageTitle").textContent = sectionName;
        $("#pageSubtitle").textContent = `Manage your ${sectionName.toLowerCase()} in BackupVault.`;

        const targetMap = {
            dashboard: ".stats-grid",
            backups: "#backupsPanel",
            history: "#backupsPanel",
            storage: "#storagePanel",
            recovery: "#backupsPanel",
            schedule: ".schedule-panel",
            security: "#securityPanel",
            settings: "#securityPanel"
        };

        const target = document.querySelector(targetMap[section] || ".stats-grid");
        target.scrollIntoView({ behavior: "smooth", block: "start" });

        if (section === "recovery") {
            showToast("Select a successful backup and click its restore icon.");
        } else if (section === "settings") {
            showToast("Settings are presented as a frontend demo.");
        } else if (section === "history") {
            showToast("Backup history is available in the backup table.");
        }

        $("#sidebar").classList.remove("open");
    });
});

$("#menuToggle").addEventListener("click", () => {
    $("#sidebar").classList.toggle("open");
});

document.addEventListener("click", (event) => {
    const sidebar = $("#sidebar");
    if (
        window.innerWidth <= 900 &&
        sidebar.classList.contains("open") &&
        !sidebar.contains(event.target) &&
        !$("#menuToggle").contains(event.target)
    ) {
        sidebar.classList.remove("open");
    }
});

const today = new Date();
$("#todayLabel").textContent = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
}).toUpperCase();

renderBackups();
