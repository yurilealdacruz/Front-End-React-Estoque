// src/components/QRCodeModal.jsx
import React, { useRef } from "react";
import QRCode from "react-qr-code";

const QRCodeModal = ({ url, onClose }) => {
  const qrRef = useRef();

  if (!url) return null;

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const qrElement = qrRef.current;
    if (!qrElement) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir QR Code</title>
          <style>
            body { display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; padding: 20px; }
            img { margin-bottom: 10px; }
            p { word-break: break-all; text-align: center; }
          </style>
        </head>
        <body>
          ${qrElement.outerHTML}
          <p>${url}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>QR Code do Estoque</h2>
        <div
          style={{ display: "flex", justifyContent: "center", margin: "20px" }}
          ref={qrRef}
        >
          <QRCode value={url} size={200} />
        </div>
        <p style={{ textAlign: "center", wordBreak: "break-all" }}>{url}</p>

        <div className="modal-actions" style={{ display: "flex", justifyContent: "space-between" }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Fechar
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            Imprimir
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
