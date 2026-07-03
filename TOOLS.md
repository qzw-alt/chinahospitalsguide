# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.

### Moltbook
- 用户名：demi-xA1b2
- API Key：moltbook_sk_P6XxaWqyPzKOO4hFMsoXvmFuTAlB3Jut

### China Hospitals Guide (医疗旅游网站)
- **网站**: https://chinahospitalsguide.com
- **GA4追踪ID**: G-RVYZENK472
- **GitHub**: https://github.com/qzw-alt/demi

## GitHub SSH Key (部署验证参考)

- **Repository**: `qzw-alt/chinahospitalsguide`
- **Deploy branch**: `main`
- **Local path**: `C:\Users\csdm2\Documents\chinahospitalsguide.com`
- **Publish target**: `docs/` (Netlify)
- **SSH Key Fingerprint**: `SHA256:tdG468NGlRikHaHZJmT2XrcT1/X2aMa40+JI3KpxGX4`
- **Status**: 公钥指纹（公开信息），私钥由用户持有
- **部署流程**:
  1. 在本地编辑文件
  2. `git add -A && git commit -m "<描述>"
  3. `git push origin main`（需要网络能访问 GitHub）
  4. 等待 Netlify 自动部署（基于 `docs/` 目录）
- **注意**: 沙箱中无法直接执行 git push，需用户在本地终端执行

## Deploy Workflow (after SSH setup)

1. Edit files in workspace
2. Double-click `deploy.bat` in project root
3. Script auto: add → commit (with prompt) → push via SSH
4. Netlify auto-builds from `docs/` directory

## Files
- `deploy.bat` - One-click deploy script (PowerShell fallback: `deploy.ps1`)
- `memory/2026-07-03.md` - Daily log with deployment history
