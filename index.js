document.getElementById("date").innerHTML = new Date().toLocaleDateString();

document.addEventListener("DOMContentLoaded", function () {
  function hesaplaHamMal() {
    var totalOran = 0;
    const uyariDiv = document.getElementById("uyari");
    uyariDiv.style.display = "none";
    for (let i = 1; i <= 5; i++) {
      const oran =
        parseFloat(
          document.querySelector(`[name="oran${i === 1 ? "" : i}"]`).value
        ) || 0;

      totalOran += oran;
    }

    if (totalOran > 100) {
      uyariDiv.style.display = "block";
      uyariDiv.textContent = `Uyari Az >>> Kumas Orani %${totalOran} Oldu.`;
      return;
    }

    if (totalOran < 100) {
      uyariDiv.style.display = "block";
      uyariDiv.textContent = `Uyari Az >>> Kumas Orani %${totalOran} Oldu.`;
      return;
    }

    if (totalOran === 100) {
      uyariDiv.style.display = "none";
    }
    let toplam = 0;
    for (let i = 1; i <= 5; i++) {
      const fiyat =
        parseFloat(document.querySelector(`#fiyat${i === 1 ? "" : i}`).value) ||
        0;
      const oran =
        parseFloat(
          document.querySelector(`[name="oran${i === 1 ? "" : i}"]`).value
        ) || 0;
      const fire =
        parseFloat(
          document.querySelector(`[name="fire${i === 1 ? "" : i}"]`).value
        ) || 0;

      let sonuc = fiyat * (oran / 100);

      sonuc += sonuc * (fire / 100);

      toplam += sonuc;
    }

    const hamMalTd = document.querySelector(
      ".sonuc table.table-alt tbody tr:first-child th:nth-child(2)"
    );
    if (hamMalTd) {
      hamMalTd.textContent = toplam.toFixed(2) + "₺";
    }
  }

  document
    .querySelector('[name="submit"]')
    .addEventListener("click", function (e) {
      e.preventDefault();
      hesaplaHamMal();
    });
});
