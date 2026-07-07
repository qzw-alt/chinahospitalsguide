# Maria Rios 案 — 30 分钟后再回来时的执行清单

> **目的**：让伟烨半小时后回来，按顺序点几下就完成 Maria 的 Sinosend 复活 + 唐都询单。
> **承诺时间线**：给 Maria 反馈"2-3 个工作日"（已于 v3 邮件承诺）

---

## ⏰ 0 分钟：回来读这个文件

---

## 🅰️ 阶段 A：让 Maria 重发链接（30 分钟内）— 现在即可发

### 选 A1：用之前那封邮件加塞一句 → `draft-followup-maria-sinosend-link.md`
**主题：** Re: Sinosend link – could you re-share it?

正文底部那段最关键的话：

> If you can, the simplest way to make the link work again is to re-trigger it from your Sinosend account — log in, open the same file, and click "Share" / "Send" again. The system will then generate a fresh link with a new expiration, which is the one you can send me.

⚠️ **这封还没插这一句**——伟烨你来定要不要现在加，我直接改。

### 选 A2：发微信/WhatsApp 一句话提醒（更快）
Maria 留下过 WhatsApp（+86 157 6310 7083 反向加她）。

> "Hi Maria, the two Sinosend links I tried both return 404. Could you log in to your Sinosend account, open the file, and click 'Share' again to generate a fresh link? That would solve it on your end. Thanks — Weiye"

### A 完成判据
- Maria 回信，附新链接（`/d/XXXXXX` 或 `/w/XXXXXX` 形式）
- 不回也行，等我后面催（明天上午）

---

## 🅱️ 阶段 B：Maria 重发链接回来后

### B1：先试链接是否活（≤30 秒）
```bash
curl -sS -o /dev/null -w 'code=%{http_code} size=%{size_download} time=%{time_total}\n' \
  -A 'Mozilla/5.0' --max-time 30 '复制的链接'
```
- `code=200 size>1MB` → 活的，进 B2
- `code=200 size<=10KB` → 是验证/登录页，去要密码，B3
- `code=404` → 还是死的，让 Maria 再来一次

### B2：活的，开始下载
```bash
mkdir -p /home/ubuntu/chinahospitalsguide/_downloads/maria-rios
cd /home/ubuntu/chinahospitalsguide/_downloads/maria-rios
curl -O -J -A 'Mozilla/5.0' --max-time 7200 '复制的链接'
```
- 2.59 GB 至少要 **20-40 分钟**，挂后台跑
- 用 `Process` 跟踪进度

### B3：要密码（除非链接已带身份验证）
- Maria 重发时已经配置了收件邮箱 = `434338480@qq.com`，系统应该自动授权
- 但如果落地页要密码 → 邮件问 Maria

---

## 🅲️ 阶段 C：资料到手后

### C1：核对完整性
- 看一眼文件清单，确认有：
  - PDF 摘要（症状 + 检查）
  - 双语放射学报告（西班牙语 + 英语）
  - DICOM 影像（CT venography）
- 文件大小符合"2.59 GB"的话说明基本完整

### C2：发询单给唐都涉外医疗科
**用 `draft-inquiry-tangdu-maria-rios.md` 英文版**

| 字段 | 值 |
|------|------|
| TO | `tdcenter@fmmu.edu.cn` |
| CC | `tangdugcp@126.com` + `riosale625@gmail.com` |
| From | 434338480@qq.com |
| 主题 | `International Inquiry – Nutcracker + May Thurner, Remote Review Request` |
| 附件 | Maria 的 PDF 摘要 + 双语放射学报告 |

> ⚠️ **2026-07-07 教训**：历史上用的 `tangdu_foreign@fmmu.edu.cn` 是空地址，**已退回**。改用 `tdcenter@fmmu.edu.cn` 主投递 + `tangdugcp@126.com` 抄送。这是双通道策略。
>
> 还可以**打电话激活邮件**：029-84777777（总机），要求转涉外接待岗。

**DICOM 影像不要挂**——邮件内承诺"按医院偏好方式单独发"。

### C3：等医院回信
- **T+1（明天）**：还没回 → 我代你发提醒给唐都
- **T+3（后天晚）**：还没回 → 我代你打电话 029-84777502，问"邮件是否收到，嘟一下最近的进度"
- **T+3（后天晚）**：不管医院是否回，**给 Maria 一封状态同步邮件**说"医院那边在排"，别让她以为我们死掉了

---

## 🅳️ 阶段 D：Maria 端节奏控制

| 节点 | 动作 | 我来 / 你来 |
|------|------|------------|
| 现在 | 让 Maria 重发链接 | 👉 伟烨你来发那封英文邮件 |
| 明天上午 | 如果 Maria 没重发，发温和催 | 我来起草 + 你确认再发 |
| 资料到手 → 唐都询单发出后 | 同步 Maria 一句"已发给唐都" | 我来起草 |
| 唐都回信后 | 立即同步 Maria 给完整评估 | 我来起草 |
| 给 Maria 的反馈截止（v3 邮件承诺）| Day 3 末 | **无论唐都回没回，先同步状态** |

---

## ⚠️ 如果 Maria 重发还是 404 — 备用方案

**备用 1：让她用 Wetransfer / SendGB / 微信文件助手**
- 微信"文件传输助手"对单次文件传输有 2GB 上限，2.59 GB 不行
- Wetransfer 免费版上限 2 GB，不够
- SendGB 单次 5 GB 免费，无账号可发，**推荐**

**备用 2：让我们直接打给 Sinosend 客服**
- Sinosend 看起来是 EmailThis 旗下产品
- 客服邮箱可能是 support@sinosend.com 或 help@emailthis.io
- 但这条路太慢，**不如让 Maria 自己重新上传到一个新链接**

---

## 🎯 伟烨半小时后回来的最短路径

如果你只是想"快速搞定"：

1. **打开 `draft-followup-maria-sinosend-link.md`** → 直接复制发出去（7 分钟）
2. **等 Maria 回**（今天？明天？）
3. 她回 → 把新链接 + 解码 base64 验证活不死的话贴给我，我下载 + 出唐都询单
4. 你审完措辞，你点发送

总耗时：**今天 7 分钟 + 明天 15 分钟**，两笔搞定。
