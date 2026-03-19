# Skill Manager

## 核心功能

管理 OpenClaw 技能的使用，确保"能飞就不走"。

## 使用规则

### 1. 技能使用检查清单

每次任务前，问自己：
- [ ] 这个任务有对应的 skill 吗？
- [ ] 我应该用 skill 而不是基础工具吗？
- [ ] 我上次用这个 skill 是什么时候？

### 2. 强制使用场景

| 任务类型 | 必须使用 Skill | 禁止行为 |
|---------|---------------|---------|
| 搜索 | multi-search-engine, tavily-search | 直接 web_fetch |
| 写作 | content-research-writer, humanizer | 直接输出 |
| 网页操作 | agent-browser | 手动描述 |
| 记忆 | memory-manager | 口头说"记住" |
| 代码管理 | github | 手动文件操作 |

### 3. 技能使用记录

每次使用 skill 后记录：
- 使用场景
- 效果评价
- 遇到的问题
- 改进建议

## 快速命令

```bash
# 查看技能使用规范
skill-help

# 记录技能使用
skill-log "skill-name" "使用场景" "效果评价"

# 查看技能使用统计
skill-stats

# 检查是否有更好的 skill
skill-check "任务描述"
```
