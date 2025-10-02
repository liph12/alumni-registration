// components/QRScannerHtml5.tsx
import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import type { Html5QrcodeCameraScanConfig } from "html5-qrcode";

type Props = {
  onResult?: (decodedText: string) => void;
  fps?: number;
  qrbox?: number;
};

export default function QRScannerHtml5({
  onResult,
  fps = 10,
  qrbox = 250,
}: Props) {
  const scannerId = "html5qr-scanner";
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [currentCameraId, setCurrentCameraId] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // list cameras on mount
    let mounted = true;
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (!mounted) return;
        setCameras(devices || []);
        if (devices && devices.length) setCurrentCameraId(devices[0].id);
      })
      .catch((err) => {
        console.warn("Could not get cameras", err);
        setError(String(err));
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    // initialize instance when we actually start scanning
    if (!scanning) return;

    if (html5QrcodeRef.current === null) {
      html5QrcodeRef.current = new Html5Qrcode(scannerId, {
        // optional verbose logging:
        verbose: false,
      });
    }

    const config: Html5QrcodeCameraScanConfig = {
      fps,
      qrbox,
      // restrict formats if desired: formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
    };

    const cameraId = currentCameraId ?? ({ facingMode: "environment" } as any);

    html5QrcodeRef.current
      .start(
        cameraId,
        config,
        (decodedText /*, decodedResult*/) => {
          // got scan result
          onResult?.(decodedText);
        },
        (scanError) => {
          // optional receive scan errors
          // console.warn("scan error", scanError);
        }
      )
      .catch((err) => {
        console.error("start failed", err);
        setError(String(err));
        setScanning(false);
      });

    return () => {
      // stop on unmount or when scanning toggled off
      if (html5QrcodeRef.current && html5QrcodeRef.current.getState() === 2) {
        html5QrcodeRef.current.stop().catch(() => {
          /* ignore */
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanning, currentCameraId]);

  const handleStart = () => {
    setError(null);
    setScanning(true);
  };

  const handleStop = async () => {
    setScanning(false);
    if (html5QrcodeRef.current) {
      try {
        await html5QrcodeRef.current.stop();
      } catch (e) {
        console.warn("stop error", e);
      }
      try {
        await html5QrcodeRef.current.clear();
      } catch {}
      html5QrcodeRef.current = null;
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await Html5Qrcode.scanFileV2(file, true); // returns a string on success
      onResult?.(result);
    } catch (err: any) {
      setError(String(err));
    } finally {
      e.currentTarget.value = "";
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <label style={{ marginRight: 8 }}>
          Camera:
          <select
            value={currentCameraId ?? ""}
            onChange={(e) => setCurrentCameraId(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            {cameras.length === 0 && (
              <option value="">(no camera found)</option>
            )}
            {cameras.map((cam) => (
              <option key={cam.deviceId} value={cam.deviceId}>
                {cam.label || cam.deviceId}
              </option>
            ))}
          </select>
        </label>

        {!scanning ? (
          <button onClick={handleStart}>Start</button>
        ) : (
          <button onClick={handleStop}>Stop</button>
        )}

        <label style={{ marginLeft: 12 }}>
          Upload image:
          <input type="file" accept="image/*" onChange={handleFileUpload} />
        </label>
      </div>

      <div
        id={scannerId}
        style={{ width: qrbox, height: qrbox, border: "1px solid #ddd" }}
      />

      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </div>
  );
}
