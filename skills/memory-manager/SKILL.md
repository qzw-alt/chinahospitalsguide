# Memory Manager Skill

## ⚠️ 强制要求

**每天早上（或长时间间隔后）必须执行：**
```bash
~/.openclaw/workspace/skills/memory-manager/force-read.sh
```

**同一会话内多次对话，不需要重复读取！**

---

## 读取规则

### 1. 每天早上（必须）
- 运行 `force-read.sh` 读取所有关键记忆
- 查看 API_KEYS_AND_SKILLS.md
- 确认相关技能可用

### 2. 同一会话内（不需要）
- 已经读取过的信息，不需要再问
- 直接查文件或依赖已加载的上下文
- 不要重复读取浪费token

### 3. 什么情况下需要重新读取？
- 超过4小时没有对话
- 伟烨提到"之前说过"
- 感觉记忆可能过时了
- 开始全新的任务类型

## 核心功能

自动管理三层记忆架构（HOT/WARM/COLD），确保重要信息不丢失。

## 使用规则

### 1. 每天早上（强制）
- [ ] 运行 `force-read.sh` 读取所有关键记忆
- [ ] 查看 API_KEYS_AND_SKILLS.md
- [ ] 确认相关技能可用

### 2. 每次会话结束
- 更新今日日志
- 归档完成的任务到 COLD
- 更新 MEMORY.md 长期记忆

### 3. 触发记忆写入的条件
- 用户明确说"记住"
- 做出重要决策
- 遇到错误和解决方案
- 发现新的最佳实践

## 文件结构

```
memory/
├── hot/
│   └── HOT_MEMORY.md          # 活跃任务（当前会话）
├── warm/
│   └── WARM_MEMORY.md         # 稳定配置（偏好、规则）
├── cold/
│   └── (归档文件)              # 历史记录
├── API_KEYS_AND_SKILLS.md     # ⚠️ 权威清单（每天早上读）
├── 强制自检清单.md             # ⚠️ 执行前检查
├── MEMORY.md                   # 长期记忆
└── YYYY-MM-DD.md              # 每日日志
```

## 快速命令

```bash
# 强制读取所有关键记忆（每天早上）
force-read.sh

# 读取当前记忆状态
memory-manager read

# 写入重要信息
memory-manager write "内容" --type [decision|preference|error|general]

# 搜索记忆
memory-manager search "关键词"

# 归档今日任务
memory-manager archive
```
