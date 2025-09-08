import { API_KEY } from "./config.js";
let usdTry = 1; // Varsayılan değer
let usdEuro = 1; // Varsayılan değer
function dovizGetir() {
  fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`)
    .then((response) => response.json())
    .then((data) => {
      usdTry = data.conversion_rates.TRY;
      usdEuro = data.conversion_rates.EUR;
      const usdTd = document.querySelector('td[style*="$"]');
      const euroTd = document.querySelector('td[style*="€"]');
      if (usdTd) {
        usdTd.textContent = `$ ${usdTry.toFixed(2)}`;
      }
      if (euroTd) {
        euroTd.textContent = `€ ${usdEuro.toFixed(2)}`;
      }
    })
    .catch((error) => {
      console.error("Döviz bilgisi alınamadı:", error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  dovizGetir();

  function hesaplaHamMal() {
    console.log("Güncel USD/TRY:", usdTry);
    console.log("Güncel EUR/TRY:", usdEuro);
    let toplam = 0;
    let oranToplam = 0;
    const uyariDiv = document.getElementById("uyari");
    uyariDiv.style.display = "none";
    uyariDiv.textContent = "";

    // Satır eksiklerini kontrol et ve kırmızı border uygula
    for (let i = 1; i <= 5; i++) {
      const iplikInput = document.querySelector(`#iplik${i === 1 ? "" : i}`);
      const fiyatInput = document.querySelector(`#fiyat${i === 1 ? "" : i}`);
      const oranInput = document.querySelector(
        `[name="oran${i === 1 ? "" : i}"]`
      );
      const fireInput = document.querySelector(
        `[name="fire${i === 1 ? "" : i}"]`
      );

      const iplik = iplikInput ? iplikInput.value.trim() : "";
      const fiyat = fiyatInput ? fiyatInput.value.trim() : "";
      const oran = oranInput ? oranInput.value.trim() : "";
      const fire = fireInput ? fireInput.value.trim() : "";

      const alanlar = [iplikInput, fiyatInput, oranInput, fireInput];
      const degerler = [iplik, fiyat, oran, fire];
      const doluSayisi = degerler.filter((v) => v !== "").length;

      if (doluSayisi > 0 && doluSayisi < alanlar.length) {
        alanlar.forEach((input, idx) => {
          if (input && degerler[idx] === "") {
            input.style.border = "2px solid red";
          } else if (input) {
            input.style.border = "";
          }
        });
        uyariDiv.style.display = "block";
        uyariDiv.textContent =
          "Eksik bilgi girilen satırlar kırmızı ile işaretlendi!";
      } else {
        alanlar.forEach((input) => {
          if (input) input.style.border = "";
        });
      }
    }

    // Oran toplamı kontrolü
    for (let i = 1; i <= 5; i++) {
      const oran =
        parseFloat(
          document.querySelector(`[name="oran${i === 1 ? "" : i}"]`).value
        ) || 0;
      oranToplam += oran;
    }

    if (oranToplam !== 100) {
      uyariDiv.style.display = "block";
      uyariDiv.textContent +=
        (uyariDiv.textContent ? "\n" : "") +
        `Uyarı: Kumaş oranı %${oranToplam} oldu. Toplam %100 olmalı!`;
    }

    // Hesaplama
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
      );
      if (radio && radio.value === "2") {
        sonuc *= usdTry;
      }
      toplam += sonuc;
    }

    const ormeFiyat = document.getElementById("ormefason");

    if (ormeFiyat) {
      const ormeValue = parseFloat(ormeFiyat.value) || 0;
      toplam += ormeValue;
    }

    // Ham Mal. ve USD karşılığı
    const hamMalTd = document.querySelector(
      ".sonuc table.table-alt tbody tr:first-child th:nth-child(2)"
    );
    const hamMalUsdTd = document.querySelector(
      ".sonuc table.table-alt tbody tr:first-child th:nth-child(3)"
    );
    const hamMalEuTd = document.querySelector(
      ".sonuc table.table-alt tbody tr:first-child th:nth-child(4)"
    );
    if (hamMalTd) {
      hamMalTd.textContent = toplam.toFixed(2) + "₺";
      if (usdTry > 0 && hamMalUsdTd) {
        const usdValue = toplam / usdTry;
        hamMalUsdTd.textContent = `${usdValue.toFixed(2)}$`;
      }
    }
    if (hamMalEuTd) {
      const euValue = toplam / usdTry / usdEuro;
      hamMalEuTd.textContent = `${euValue.toFixed(2)}€`;
    }

    // Kar oranı ve Ham Satış
    const karOraniInput = document.getElementById("kar");
    const karOrani = karOraniInput ? parseFloat(karOraniInput.value) || 0 : 0;
    const hamSatis = toplam + (toplam * karOrani) / 100;
    const hamSatisTd = document.querySelector(
      ".sonuc table.table-alt tbody tr:nth-child(2) th:nth-child(2)"
    );
    const hamSatisUSDId = document.querySelector(
      ".sonuc table.table-alt tbody tr:nth-child(2) th:nth-child(3)"
    );
    const hamSatisEUId = document.querySelector(
      ".sonuc table.table-alt tbody tr:nth-child(2) th:nth-child(4)"
    );
    if (hamSatisTd) {
      hamSatisTd.textContent = hamSatis.toFixed(2) + "₺";
    }
    if (hamSatisUSDId) {
      hamSatisUSDId.textContent = `${(hamSatis / usdTry).toFixed(2)}$`;
    }
    if (hamSatisEUId) {
      hamSatisEUId.textContent = `${(hamSatis / usdTry / usdEuro).toFixed(2)}€`;
    }

    const boyafasonInput = document.getElementById("boyafason");
    const boyafireInput = document.getElementById("boyafire");
    const boyafireOran = boyafireInput
      ? parseFloat(boyafireInput.value) || 0
      : 0;
    const boyafason = boyafasonInput
      ? parseFloat(boyafasonInput.value) || 0
      : 0;
    let boyaliMaliyet = toplam + boyafason;
    boyaliMaliyet += (boyaliMaliyet * boyafireOran) / 100;

    const boyaliMaliyetId = document.querySelector(
      "#boyaliTablo tr:nth-child(1) th:nth-child(2)"
    );
    const bolayiMaliyetUsdId = document.querySelector(
      "#boyaliTablo tr:nth-child(1) th:nth-child(3)"
    );
    const bolayiMaliyetEuId = document.querySelector(
      "#boyaliTablo tr:nth-child(1) th:nth-child(4)"
    );
    if (boyaliMaliyetId) {
      boyaliMaliyetId.textContent = boyaliMaliyet.toFixed(2) + "₺";
    }

    if (bolayiMaliyetUsdId) {
      bolayiMaliyetUsdId.textContent = `${(boyaliMaliyet / usdTry).toFixed(
        2
      )}$`;
    }
    if (bolayiMaliyetEuId) {
      bolayiMaliyetEuId.textContent = `${(
        boyaliMaliyet /
        usdTry /
        usdEuro
      ).toFixed(2)}€`;
    }

    let boyaliSatis = boyaliMaliyet + (boyaliMaliyet * karOrani) / 100;
    const boyaliSatisId = document.querySelector(
      "#boyaliTablo tr:nth-child(2) th:nth-child(2)"
    );
    const bolayiSatisUsdId = document.querySelector(
      "#boyaliTablo tr:nth-child(2) th:nth-child(3)"
    );
    const bolayiSatisEuId = document.querySelector(
      "#boyaliTablo tr:nth-child(2) th:nth-child(4)"
    );
    if (boyaliSatisId) {
      boyaliSatisId.textContent = boyaliSatis.toFixed(2) + "₺";
    }
    if (bolayiSatisUsdId) {
      bolayiSatisUsdId.textContent = `${(boyaliSatis / usdTry).toFixed(2)}$`;
    }
    if (bolayiSatisEuId) {
      bolayiSatisEuId.textContent = `${(boyaliSatis / usdTry / usdEuro).toFixed(
        2
      )}€`;
    }
  }
  document
    .querySelector('[name="submit"]')
    .addEventListener("click", function (e) {
      e.preventDefault();
      hesaplaHamMal();
    });
});
