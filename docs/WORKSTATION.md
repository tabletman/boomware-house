# Workstation & Networking — Dell (Quadro P5000) and iMac (Sequoia host)

This file contains the machine-specific recommendations and networking/“sharing brains” guidance. (Repository‑centric docs and automation instructions remain in docs/README.md.)

## Machines described
- Dell workstation:
  - GPU: NVIDIA Quadro P5000 — 16 GB VRAM (only GPU)
  - CPU: Dual Xeon
  - RAM: ~190 GB (uneven)
- iMac (remote / Sequoia host):
  - CPU: Intel Core i9 (8‑core, 3.6 GHz)
  - GPU: Radeon Pro 580X — 8 GB VRAM
  - RAM: 32 GB DDR4

## Recommended OS for the Dell
- Pop!_OS (NVIDIA edition) is recommended for the easiest NVIDIA/CUDA driver experience.
- Alternative: Ubuntu LTS (with `graphics-drivers` PPA) if you prefer Ubuntu server/desktop variants.

(See docs/POP_OS.md for download link and quick install verification commands.)

## Drivers, CUDA, and container support
- After installing Pop!_OS (NVIDIA ISO), verify:
  ```bash
  nvidia-smi
  uname -a
  ```
- Install Docker and NVIDIA Container Toolkit to run GPU-enabled containers:
  ```bash
  sudo apt update
  sudo apt install -y docker.io
  sudo systemctl enable --now docker
  # Install nvidia-container-toolkit per distro instructions, then:
  sudo apt install -y nvidia-container-toolkit
  sudo systemctl restart docker
  docker run --rm --gpus all nvidia/cuda:12.2.0-base-ubuntu22.04 nvidia-smi
  ```

## Which models to run locally (guidance for a Quadro P5000 with 16 GB VRAM)
- Reality check:
  - 16 GB VRAM is modest for modern transformer LLMs. It’s great for moderate inference workloads and smaller LLMs with quantization or CPU offload.
  - You have a lot of system RAM (~190 GB). Use CPU RAM for offloading larger models when necessary.

- Recommended local options:
  - Llama-2 / Meta models:
    - 7B variants (Llama-2-7B) — reasonable candidate if you use 4-bit or 8-bit quantization (CUDA-accelerated inference frameworks or `ggml`/`llama.cpp` variants).
  - Falcon-7B or Mistral-7B — often deployable with quantization/CPU offload.
  - Smaller instruction-tuned models (7B or smaller) — more manageable on 16 GB VRAM.
  - Use 4‑bit (e.g., Q4_K_M or similar) quantization and frameworks that support CUDA kernels for quantized weights (bitsandbytes / GGML / vLLM with quantization plugins).
  - For very large models (13B+), consider:
    - CPU offload (trade latency for larger context and model size).
    - Model sharding across machines (complex — requires frameworks like DeepSpeed, vLLM with offload, or commercial inference servers).

- Practical patterns:
  - Run small/medium models locally (7B) for interactive tasks.
  - Use the iMac (Sequoia) or a remote beefier host for heavy model inference if needed; treat the Dell as a GPU compute node for acceleration and containerized tasks.

## Inference & deployment strategies
- Quantization: reduce model memory footprint (4-bit recommended when supported).
- CPU offload: use system RAM to hold parts of the model; your 190 GB RAM is a big advantage.
- Containerization: run models inside Docker containers with `--gpus all`.
- Model serving: use Triton, vLLM, or custom FastAPI/Flask service depending on latency needs.

## Sharing compute between machines (networking & orchestration)
- Direct Ethernet (recommended for low-latency, private link):
  - Example static IP plan:
    - iMac (Sequoia): 192.168.50.2/24
    - Dell: 192.168.50.3/24
  - On macOS (iMac): set Ethernet to manual with 192.168.50.2
  - On Pop!_OS (Dell) temporary:
    ```bash
    sudo ip addr add 192.168.50.3/24 dev eth0
    sudo ip link set eth0 up
    ```
  - Persistent via NetworkManager (nmcli):
    ```bash
    sudo nmcli connection modify "Wired connection 1" ipv4.method manual ipv4.addresses 192.168.50.3/24 ipv4.gateway 192.168.50.2 ipv4.dns 1.1.1.1
    sudo nmcli connection up "Wired connection 1"
    ```

- SSH access:
  - Enable `Remote Login` on macOS (System Settings > General > Sharing > Remote Login).
  - SSH test:
    ```bash
    ssh -p 22 <mac_user>@192.168.50.2 'echo OK; uname -a; uptime'
    ```

- Deploying artifacts / scripts:
  - Use `rsync` for fast, incremental sync:
    ```bash
    rsync -avz -e "ssh -p 22" ./deploy-script.sh <mac_user>@192.168.50.2:/home/<mac_user>/deploy-script.sh
    ssh -p 22 <mac_user>@192.168.50.2 'bash ~/deploy-script.sh'
    ```

- Model endpoint orchestration:
  - Run the model server on the machine you choose (iMac or Dell).
  - Use HTTP(S) endpoints secured by tokens; call them from the other machine over the private link.
  - Example curl test:
    ```bash
    curl -s -X POST "http://192.168.50.2:8080/v1/infer" -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{"input":"hello"}'
    ```

## Validation & monitoring
- Quick system health check:
  ```bash
  echo "USER: $(whoami)"; uname -a; free -h; df -h .; nvidia-smi --query-gpu=name,memory.total,memory.used,utilization.gpu --format=csv,noheader,nounits || true
  ```
- GPU monitoring loop:
  ```bash
  watch -n 5 'nvidia-smi --format=csv --query-gpu=index,name,memory.total,memory.used,utilization.gpu'
  ```
- Logs: centralize logs from containers and model servers (e.g., `docker logs -f <container>`).

## Practical recommendations
- Use Pop!_OS (NVIDIA ISO) for easiest driver support.
- Install Docker + NVIDIA container toolkit for consistent reproducible environments.
- Use quantized 7B models for responsive local inference on the P5000; offload larger models to CPU memory or a remote host with more VRAM.
- Keep sensitive keys in environment variables or a secrets manager; do not store API keys in plaintext in repo.

## When to use the iMac vs Dell
- Use the iMac (Sequoia host) for models you already run there (macOS-friendly toolchain / Apple Silicon optimization if applicable).
- Use the Dell for GPU‑accelerated workloads (CUDA, Docker with `--gpus all`), batch processing and any heavier GPU jobs.
- Orchestrate with a small HTTP API or AgentWise tasks so each machine has a clear role.

## Next steps
- If you want, I can:
  - Produce a small Docker Compose + model service example that runs a quantized 7B model using the NVIDIA container toolkit.
  - Produce an Ansible or shell provisioning script to set up Pop!_OS + Docker + NVIDIA toolkit on the Dell.
  - Produce a Warp Workflow JSON to run health checks and smoke tests across both machines.

Tell me what automation or artifact you want next (Docker compose, provisioning script, Warp Workflow, or commit these docs into the repo).