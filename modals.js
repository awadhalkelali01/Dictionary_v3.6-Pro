/*******************************************
 *  نظام المودال + دعم الثيمات
 *******************************************/

// ← تطبيق الثيم مباشرة عند فتح أي صفحة
document.body.classList.add(localStorage.getItem("theme") || "theme-blue");

// -----------------------------------------
// عرض الـ Toast
// -----------------------------------------
function showToast(msg, type = "ok") {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = msg;

    if (type === "warn") toast.style.background = "#d9534f";
    else toast.style.background = "var(--primary)";

    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

// -----------------------------------------
// مودال بسيط برسالة + زر موافق
// -----------------------------------------
function showModal(title, msg, onok) {
    const backdrop = document.getElementById("sharedModalBackdrop");
    const box = document.getElementById("sharedModal");

    box.innerHTML = `
        <h2>${title}</h2>
        <p>${msg}</p>
        <div style="text-align:left;">
            <button class="btn btn-main" id="modalOK">موافق</button>
        </div>
    `;

    backdrop.style.display = "flex";

    document.getElementById("modalOK").onclick = () => {
        backdrop.style.display = "none";
        if (onok) onok();
    };
}

// -----------------------------------------
// مودال تأكيد (نعم/لا)
// -----------------------------------------
function showConfirm(title, msg, onyes) {
    const backdrop = document.getElementById("sharedModalBackdrop");
    const box = document.getElementById("sharedModal");

    box.innerHTML = `
        <h2>${title}</h2>
        <p>${msg}</p>
        <div style="text-align:left;">
            <button class="btn btn-main" id="modalYes">نعم</button>
            <button class="btn btn-secondary" id="modalNo">إلغاء</button>
        </div>
    `;

    backdrop.style.display = "flex";

    document.getElementById("modalYes").onclick = () => {
        backdrop.style.display = "none";
        if (onyes) onyes();
    };

    document.getElementById("modalNo").onclick = () => {
        backdrop.style.display = "none";
    };
}

// -----------------------------------------
// مودال إدخال نص
// -----------------------------------------
function showPrompt(title, label, placeholder, value, onok) {
    const backdrop = document.getElementById("sharedModalBackdrop");
    const box = document.getElementById("sharedModal");

    box.innerHTML = `
        <h2>${title}</h2>
        <label>${label}</label>
        <input id="promptInput" type="text" placeholder="${placeholder}" value="${value || ""}" style="width:100%;padding:8px;margin:8px 0;">
        <div style="text-align:left;">
            <button class="btn btn-main" id="modalOK">موافق</button>
            <button class="btn btn-secondary" id="modalCancel">إلغاء</button>
        </div>
    `;

    backdrop.style.display = "flex";

    document.getElementById("modalOK").onclick = () => {
        const val = document.getElementById("promptInput").value.trim();
        backdrop.style.display = "none";
        if (onok) onok(val);
    };

    document.getElementById("modalCancel").onclick = () => {
        backdrop.style.display = "none";
    };
}

// -----------------------------------------
// مودال نموذج (عدة مدخلات)
// -----------------------------------------
function showModalForm(title, fields, onok) {
    const backdrop = document.getElementById("sharedModalBackdrop");
    const box = document.getElementById("sharedModal");

    let html = `<h2>${title}</h2>`;

    fields.forEach(f => {
        html += `<label>${f.label}</label>`;

        if (f.type === "select") {
            html += `<select id="field_${f.name}" style="width:100%;padding:8px;margin:8px 0;">`;
            f.options.forEach(opt => {
                html += `<option value="${opt.value}" ${opt.value == f.value ? "selected" : ""}>${opt.text}</option>`;
            });
            html += `</select>`;
        } else {
            html += `<input id="field_${f.name}" type="text" value="${f.value || ""}" style="width:100%;padding:8px;margin:8px 0;">`;
        }
    });

    html += `
        <div style="text-align:left;">
            <button class="btn btn-main" id="modalOK">حفظ</button>
            <button class="btn btn-secondary" id="modalCancel">إلغاء</button>
        </div>
    `;

    box.innerHTML = html;
    backdrop.style.display = "flex";

    document.getElementById("modalOK").onclick = () => {
        const vals = {};
        fields.forEach(f => {
            vals[f.name] = document.getElementById(`field_${f.name}`).value;
        });
        backdrop.style.display = "none";
        if (onok) onok(vals);
    };

    document.getElementById("modalCancel").onclick = () => {
        backdrop.style.display = "none";
    };
}
