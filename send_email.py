#!/usr/bin/env python3
import os
import smtplib
from email.message import EmailMessage

# Lê variáveis de ambiente (NÃO HARDCODE)
RECIPIENT = os.getenv("RECIPIENT_EMAIL")
SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")

TESTS_STATUS = os.getenv("TESTS_STATUS", "unknown")
BUILD_STATUS = os.getenv("BUILD_STATUS", "unknown")

if not RECIPIENT:
    raise SystemExit("RECIPIENT_EMAIL env var not set. Aborting.")

msg = EmailMessage()
msg["From"] = SMTP_USER if SMTP_USER else "noreply@example.com"
msg["To"] = RECIPIENT
msg["Subject"] = f"CI/CD Pipeline Result - tests={TESTS_STATUS}, build={BUILD_STATUS}"
body = f"""Pipeline executado!
Resultados:
- Tests: {TESTS_STATUS}
- Build: {BUILD_STATUS}

Artefatos:
- test-report (uploaded)
- package (uploaded)

Atenciosamente,
Sistema de CI/CD
"""
msg.set_content(body)

# If no SMTP credentials set, print message (useful for debug)
if not SMTP_HOST:
    print("SMTP_HOST not set. Printing email contents instead:")
    print("---- EMAIL ----")
    print("To:", RECIPIENT)
    print(msg)
    print("---- END EMAIL ----")
else:
    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            if SMTP_USER and SMTP_PASS:
                server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)
        print("Email enviado com sucesso para", RECIPIENT)
    except Exception as e:
        print("Falha ao enviar email:", e)
        raise