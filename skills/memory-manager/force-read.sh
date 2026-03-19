#!/bin/bash
# 强制记忆读取脚本 - 每次会话开始时执行

echo "=========================================="
echo "🔴 强制记忆读取 - 不可跳过"
echo "=========================================="

# 1. 读取 API Keys 和技能状态（最重要）
echo -e "\n📋 [1/5] API Keys 和技能状态..."
if [ -f "$HOME/.openclaw/workspace/memory/API_KEYS_AND_SKILLS.md" ]; then
    head -50 "$HOME/.openclaw/workspace/memory/API_KEYS_AND_SKILLS.md"
else
    echo "❌ 未找到 API_KEYS_AND_SKILLS.md"
fi

# 2. 读取活跃任务
echo -e "\n🔥 [2/5] 活跃任务 (HOT_MEMORY)..."
if [ -f "$HOME/.openclaw/workspace/memory/hot/HOT_MEMORY.md" ]; then
    cat "$HOME/.openclaw/workspace/memory/hot/HOT_MEMORY.md"
else
    echo "(无活跃任务)"
fi

# 3. 读取今日日志
echo -e "\n📅 [3/5] 今日日志..."
TODAY=$(date +%Y-%m-%d)
if [ -f "$HOME/.openclaw/workspace/memory/$TODAY.md" ]; then
    cat "$HOME/.openclaw/workspace/memory/$TODAY.md"
else
    echo "(今日暂无记录)"
fi

# 4. 检查客户相关配置
echo -e "\n💼 [4/5] 客户相关配置..."
echo "AgentMail 邮箱: motionlessbottle950@agentmail.to"
echo "WhatsApp: +44 7947 060056"
if [ -d "$HOME/.openclaw/workspace/memory/医疗旅游_文案库" ]; then
    echo "邮件模板:"
    ls -1 "$HOME/.openclaw/workspace/memory/医疗旅游_文案库/" | grep -E "邮件|模板" | head -5
fi

# 5. 关键提醒
echo -e "\n⚠️  [5/5] 关键提醒..."
echo "• AgentMail 已配置，可以处理客户邮件"
echo "• Tavily API 已配置，可以深度搜索"
echo "• GitHub Token 已配置，可以推送代码"
echo "• 不要问伟烨 API key 是否存在，查此清单"

echo -e "\n=========================================="
echo "✅ 强制记忆读取完成"
echo "=========================================="
