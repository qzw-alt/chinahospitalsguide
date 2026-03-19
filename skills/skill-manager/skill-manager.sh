#!/bin/bash
# Skill Manager - 技能管理脚本

SKILL_DIR="$HOME/.openclaw/workspace/skills"
LOG_FILE="$HOME/.openclaw/workspace/memory/skill-usage.log"

# 确保日志文件存在
touch "$LOG_FILE"

# 显示帮助
skill_help() {
    cat << 'EOF'
=== 🔧 Skill Manager - 技能使用规范 ===

【强制使用场景】
搜索      → multi-search-engine, tavily-search
写作      → content-research-writer, humanizer
网页操作   → agent-browser
记忆      → memory-manager
code管理  → github

【使用检查清单】
□ 这个任务有对应的 skill 吗？
□ 我应该用 skill 而不是基础工具吗？
□ 我上次用这个 skill 是什么时候？

【核心原则】
"能飞就不走" - 有 skill 必须用，没 skill 找 skill

【API Keys 状态】
查看完整清单: cat ~/.openclaw/workspace/memory/API_KEYS_AND_SKILLS.md

【快速查询】
skill-status  - 查看所有技能状态
EOF
}

# 记录技能使用
skill_log() {
    local skill_name="$1"
    local scenario="$2"
    local evaluation="$3"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    echo "[$timestamp] $skill_name | $scenario | $evaluation" >> "$LOG_FILE"
    echo "✅ 已记录技能使用"
}

# 查看使用统计
skill_stats() {
    echo "=== 📊 技能使用统计 ==="
    if [ -f "$LOG_FILE" ]; then
        echo "最近使用:"
        tail -20 "$LOG_FILE"
        echo -e "\n使用频率:"
        cut -d']' -f2 "$LOG_FILE" | cut -d'|' -f1 | sort | uniq -c | sort -rn | head -10
    else
        echo "暂无记录"
    fi
}

# 检查任务对应的 skill
skill_check() {
    local task="$1"
    echo "=== 🔍 任务: $task ==="
    echo ""
    
    # 关键词匹配
    case "$task" in
        *搜索*|*查找*|*调研*)
            echo "推荐技能:"
            echo "  • multi-search-engine (并行多引擎搜索)"
            echo "  • tavily-search (深度研究)"
            ;;
        *写作*|*文章*|*文案*)
            echo "推荐技能:"
            echo "  • content-research-writer (内容研究写作)"
            echo "  • humanizer (去除AI痕迹)"
            ;;
        *网页*|*点击*|*填写*)
            echo "推荐技能:"
            echo "  • agent-browser (浏览器自动化)"
            ;;
        *记忆*|*记住*|*记录*)
            echo "推荐技能:"
            echo "  • memory-manager (记忆管理)"
            ;;
        *代码*|*git*|*推送*)
            echo "推荐技能:"
            echo "  • github (GitHub操作)"
            ;;
        *图片*|*生成*|*绘制*)
            echo "推荐技能:"
            echo "  • image-generation (AI图片生成)"
            ;;
        *视频*|*剪辑*)
            echo "推荐技能:"
            echo "  • CLI-Anything (控制本地视频软件)"
            ;;
        *)
            echo "未识别任务类型，请手动检查可用技能:"
            ls -1 "$SKILL_DIR"
            ;;
    esac
}

# 查看所有技能状态
skill_status() {
    echo "=== 📋 API Keys 和技能状态 ==="
    if [ -f "$HOME/.openclaw/workspace/memory/API_KEYS_AND_SKILLS.md" ]; then
        cat "$HOME/.openclaw/workspace/memory/API_KEYS_AND_SKILLS.md"
    else
        echo "❌ 未找到状态文件"
    fi
}

# 检查任务是否需要 Ralph Loop
ralph_check() {
    local task_type="$1"
    
    echo "=== 🔄 Ralph Loop 强制检查 ==="
    
    case "$task_type" in
        blog|文章|写作)
            echo "任务类型: 博客文章生成"
            echo "✅ 必须使用 Ralph Loop 流程"
            echo ""
            echo "检查清单:"
            echo "  □ 第1轮: 研究 (Tavily深度搜索)"
            echo "  □ 第2轮: 大纲 (基于研究结果)"
            echo "  □ 第3轮: 撰写 (生成完整内容)"
            echo "  □ 第4轮: 检查 (humanizer优化)"
            echo "  □ 第5轮: 输出 (HTML+Markdown)"
            echo ""
            echo "质量门禁:"
            echo "  - 字数 > 500 词"
            echo "  - 包含费用对比"
            echo "  - 包含医院信息"
            echo "  - 包含联系方式"
            echo "  - 经过 humanizer 检查"
            echo ""
            echo "使用方法:"
            echo "  ~/.openclaw/workspace/skills/ralph-loop/ralph-blog.sh \"主题\""
            ;;
            
        email|邮件|回复)
            echo "任务类型: 客户邮件回复"
            echo "✅ 必须使用 Ralph Loop 流程"
            echo ""
            echo "检查清单:"
            echo "  □ 第1轮: 分析客户需求"
            echo "  □ 第2轮: 匹配医院资源"
            echo "  □ 第3轮: 生成回复邮件"
            echo "  □ 第4轮: 检查模板合规性"
            echo "  □ 第5轮: 发送并记录"
            ;;
            
        report|报告|监控)
            echo "任务类型: 竞品监控报告"
            echo "✅ 必须使用 Ralph Loop 流程"
            echo ""
            echo "检查清单:"
            echo "  □ 第1轮: 抓取竞品网站"
            echo "  □ 第2轮: 提取关键变化"
            echo "  □ 第3轮: 分析影响"
            echo "  □ 第4轮: 生成报告"
            echo "  □ 第5轮: 推送飞书"
            ;;
            
        *)
            echo "任务类型: 其他"
            echo "⚠️  评估是否需要 Ralph Loop"
            echo ""
            echo "需要 Ralph Loop 的特征:"
            echo "  - 多步骤任务"
            echo "  - 需要迭代改进"
            echo "  - 有明确完成标准"
            echo "  - 输出质量要求高"
            ;;
    esac
}

# 主入口
case "$1" in
    help)
        skill_help
        ;;
    log)
        skill_log "$2" "$3" "$4"
        ;;
    stats)
        skill_stats
        ;;
    check)
        skill_check "$2"
        ;;
    status)
        skill_status
        ;;
    ralph)
        ralph_check "$2"
        ;;
    *)
        echo "用法: skill-manager [help|log|stats|check|list]"
        echo "  help          - 显示使用规范"
        echo "  log name scenario eval  - 记录技能使用"
        echo "  stats         - 查看使用统计"
        echo "  check '任务'   - 检查推荐技能"
        echo "  ralph [blog|email|report] - Ralph Loop强制检查"
        ;;
esac
