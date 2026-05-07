# Airbnb Project - DevOps Setup

## Local development (Docker Compose)

```bash
docker compose up --build -d
```

Open:
- `http://localhost:8000/listings`
- `http://localhost:8000/health`
- `http://localhost:8000/metrics`

Seed DB in Docker:

```bash
docker exec wonderlust-app node init/index.js
```

Stop:

```bash
docker compose down
```

## Production compose

Run on server:

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

Stop:

```bash
docker compose -f docker-compose.prod.yml down
```

Production entrypoint:
- `http://<EC2_PUBLIC_IP>` (via Nginx on port 80)

## Reverse proxy + HTTPS

The production compose now runs:
- `app` (internal only, not publicly exposed)
- `mongo` (internal only)
- `nginx` (public on port `80`)

### Enable HTTPS with Let's Encrypt on EC2

1. Point your domain DNS A record to EC2 public IP.
2. Open security group ports `80` and `443`.
3. Install certbot on EC2:

```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
```

4. Run certbot:

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

5. Verify auto-renew:

```bash
sudo certbot renew --dry-run
```

## CI workflow

GitHub Actions workflow is in:
- `.github/workflows/ci.yml`

It runs on push/PR to `main`/`master`:
- `npm ci`
- `npm run lint`
- `npm test`
- Docker image build

## CD workflow (EC2 deploy)

GitHub Actions deploy workflow is in:
- `.github/workflows/cd-ec2.yml`

It can run in 2 ways:
- automatic on push to `main`/`master`
- manual from Actions tab (`workflow_dispatch`)

### Required GitHub Secrets

Add these repository secrets before running deploy:
- `EC2_HOST` - public IP or DNS of EC2
- `EC2_USER` - SSH user (usually `ubuntu`)
- `EC2_SSH_KEY` - private SSH key content used to access EC2
- `EC2_PORT` - SSH port (usually `22`)
- `EC2_APP_DIR` - absolute path of project on EC2 (example: `/home/ubuntu/airbnb-project`)

### One-time EC2 setup

1. Install Docker and Docker Compose plugin on EC2.
2. Clone this repo into `EC2_APP_DIR`.
3. Create `.env` in project root on EC2 with production values.
4. Ensure security group allows app access on `80` and `443` (no need to open `8000` publicly).

Then each push to `main`/`master` can deploy automatically.
