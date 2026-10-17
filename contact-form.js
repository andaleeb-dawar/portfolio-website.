/* Contact form submissions through Web3Forms. */
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  const status = document.getElementById("contactFormStatus");
  const submitButton = document.getElementById("contactSubmitButton");
  const submitLabel = document.getElementById("contactSubmitLabel");
  const emailFallback = document.getElementById("contactEmailFallback");
  const accessKeyPlaceholder = "YOUR_WEB3FORMS_ACCESS_KEY";
  const originalButtonLabel = submitLabel.textContent;
  let isSubmitting = false;
  let statusTimeout;

  function showStatus(state, message) {
    window.clearTimeout(statusTimeout);
    status.dataset.state = state;
    status.textContent = message;

    if (state === "success" || state === "error") {
      statusTimeout = window.setTimeout(() => {
        status.textContent = "";
        status.dataset.state = "";
      }, 5000);
    }
  }

  function updateEmailFallback(formData) {
    const subject = String(formData.get("subject") || "").trim();
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;

    emailFallback.href = `mailto:andaleebkhan021@gmail.com?${new URLSearchParams({
      subject,
      body
    })}`;
  }

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSubmitting || !contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);
    updateEmailFallback(formData);

    const accessKey = String(formData.get("access_key") || "").trim();
    if (!accessKey || accessKey === accessKeyPlaceholder) {
      showStatus(
        "error",
        "Contact form setup is incomplete. Add your Web3Forms access key, or use the email fallback below."
      );
      return;
    }

    if (window.location.protocol === "file:") {
      showStatus(
        "error",
        "Direct sending requires the portfolio to be hosted. Use the email fallback below for this local preview."
      );
      return;
    }

    formData.set("replyto", String(formData.get("email") || "").trim());
    isSubmitting = true;
    submitButton.disabled = true;
    submitLabel.textContent = "Sending...";
    showStatus("sending", "Sending your message securely...");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
      });

      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error("The email service returned an unreadable response.");
      }

      if (!result || typeof result !== "object") {
        throw new Error("The email service returned an invalid response.");
      }

      if (!response.ok || result.success !== true) {
        const apiMessage = typeof result.message === "string"
          ? result.message
          : typeof result.body?.message === "string"
            ? result.body.message
            : "The email service could not accept your message.";
        throw new Error(apiMessage);
      }

      contactForm.reset();
      showStatus("success", "Your message was sent successfully. Thank you for reaching out!");
    } catch (error) {
      console.error("Contact form submission failed:", error);
      const reason = error instanceof Error ? error.message : "A network error occurred.";
      showStatus(
        "error",
        `Your message could not be sent (${reason}). Your details are still here; try again or use the email fallback below.`
      );
    } finally {
      isSubmitting = false;
      submitButton.disabled = false;
      submitLabel.textContent = originalButtonLabel;
    }
  });
}
