function kirimKeWhatsApp() {
  // Ambil nilai dari input
  var input_name = document.getElementById("userName").value;
  var input_corporate = document.getElementById("corporateName").value;

  /* Whatsapp Settings */
  var phone = "+6285162992597"; //  nomor WhatsApp admin
  var text_no = "Isi semua formulir lalu klik Contact Admin.";

  // Validasi input
  if (input_name !== "" && input_corporate !== "") {
    var message = `Halo admin, saya *${input_name}* dari perusahaan *${input_corporate}*. Ingin bertanya terkait info corporate training.`;

    var whatsappURL = "";
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      var whatsappURL =
        "whatsapp://send?phone=" +
        phone +
        "&text=" +
        encodeURIComponent(message);
    } else {
      whatsappURL =
        "https://web.whatsapp.com/send?phone=" +
        phone +
        "&text=" +
        encodeURIComponent(message);
    }

    // Buka WhatsApp di tab baru
    window.open(whatsappURL, "_blank");
  } else {
    alert(text_no);
  }
}
