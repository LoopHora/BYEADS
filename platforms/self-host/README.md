# BYEADS — Self-Hosting Guide (Docker)

Deploy your private, self-hosted BYEADS DNS resolver with encrypted DNS forwarding, local caching, and ad/malware blocking.

## Prerequisites
- Docker Engine & Docker Compose (`docker compose version` 2.0+)
- Port 53 (UDP/TCP) available on host

## Quickstart

1. Clone and navigate to the self-host directory:
   ```bash
   git clone https://github.com/AzeemS24/BYEADS.git
   cd BYEADS/platforms/self-host
   ```
   Or if already in the repository root:
   ```bash
   cd platforms/self-host
   ```

2. Start the stack:
   ```bash
   docker compose up -d
   ```

3. Check container status:
   ```bash
   docker compose ps
   ```

4. Test DNS resolution and ad blocking:
   ```bash
   # Should return 0.0.0.0 (blocked)
   nslookup doubleclick.net 127.0.0.1

   # Should resolve normally
   nslookup wikipedia.org 127.0.0.1
   ```

5. Point your router or local device DNS to `127.0.0.1` (or your server's LAN IP).
