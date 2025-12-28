# Pop!_OS (NVIDIA) — download & quick install verification

This file contains an authoritative download link and a short post‑install verification checklist for the Pop!_OS NVIDIA image recommended for the Dell with a Quadro P5000.

## Official download
- Pop!_OS download page (choose the NVIDIA ISO):  
  https://pop.system76.com/

- Alternative System76 Pop!_OS overview / download:  
  https://system76.com/pop

Notes:
- Choose the image labelled for NVIDIA GPUs so the installer includes the proprietary NVIDIA driver stack out of the box.
- Verify the ISO checksum (if provided on the download page) before flashing to USB.

## Flash to USB
- Recommended tools:
  - On macOS: balenaEtcher, or `dd` for advanced users.
  - On Linux: balenaEtcher, `gnome-disks`, or `dd`.

Example `dd` usage (replace /dev/sdX carefully):
```bash
# Example (be _very_ careful with the target device):
sudo dd if=pop-os_XX_amd64_XX.iso of=/dev/sdX bs=4M status=progress conv=fsync
sync
```

## Post-install checks (first boot)
1. Verify NVIDIA driver & GPU:
   ```bash
   # should show GPU and driver version
   nvidia-smi
   ```

2. Kernel / distro:
   ```bash
   uname -a
   cat /etc/os-release
   ```

3. Docker + NVIDIA Container Toolkit sanity check:
   ```bash
   # install docker then:
   sudo systemctl enable --now docker
   sudo apt update
   sudo apt install -y docker.io
   # Install nvidia-container-toolkit (per distro instructions), then:
   sudo systemctl restart docker
   docker run --rm --gpus all nvidia/cuda:12.2.0-base-ubuntu22.04 nvidia-smi
   ```

## Troubleshooting
- If `nvidia-smi` does not show the GPU:
  - Reboot first.
  - Check `dmesg` / `journalctl -b` for driver load errors.
  - Confirm you installed the NVIDIA edition of the ISO (some installs start with Nouveau or no proprietary driver if you picked a non‑NVIDIA image).
- If Docker cannot access the GPU:
  - Ensure `nvidia-container-toolkit` is installed and Docker restarted.
  - Confirm `docker run --rm --gpus all nvidia/cuda:12.2.0-base-ubuntu22.04 nvidia-smi` succeeds.

---

If you'd like, I can produce:
- A one‑click provisioning script (bash/Ansible) that installs Docker, NVIDIA toolkit and configures users/groups.
- A Docker Compose example to run a quantized 7B LLM service on the Dell using the NVIDIA container toolkit.
Which would you like next?