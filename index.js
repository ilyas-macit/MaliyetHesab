let usdTry = 1; // Varsayılan değer

function dovizGetir() {
  fetch(
    "https://v6.exchangerate-api.com/v6/8e39bbb783d6097cd7b38bf2/latest/USD"
  )
    .then((response) => response.json())
    .then((data) => {
      usdTry = data.conversion_rates.TRY;
      // İsterseniz ekrana da yazabilirsiniz
      const usdTd = document.querySelector('td[style*="$"]');
      if (usdTd) {
        usdTd.textContent = `$ ${usdTry.toFixed(2)}`;
      }
    })
    .catch((error) => {
      console.error("Döviz bilgisi alınamadı:", error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  dovizGetir();

  function hesaplaHamMal() {
    // Artık usdTry değişkenini kullanabilirsiniz
    var totalOran = 0;
    const uyariDiv = document.getElementById("uyari");
    uyariDiv.style.display = "none";

    // ...mevcut kodlarınız...

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
      var radio = document.querySelector(
        `[name="kur${i === 1 ? "" : i}"]:checked`
      ).value;
      if (radio === "2") {
        console.log("Güncel USD/TRY:", usdTry);

        sonuc *= usdTry; // Burada güncel döviz değerini kullanıyoruz
      }
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
