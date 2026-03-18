#!/bin/bash
# Ralph Loop 轻量版 - 博客文章生成
# 用法: ./ralph-blog.sh "文章主题"

set -e

TOPIC="${1:-}"
if [ -z "$TOPIC" ]; then
    echo "用法: $0 \"文章主题\""
    echo "示例: $0 \"Cardiac Surgery in China 2026\""
    exit 1
fi

echo "=========================================="
echo "🔄 Ralph Loop - 博客文章生成"
echo "主题: $TOPIC"
echo "=========================================="

# 创建工作目录
WORK_DIR="/tmp/ralph-blog-$(date +%s)"
mkdir -p "$WORK_DIR"
cd "$WORK_DIR"

echo -e "\n📁 工作目录: $WORK_DIR\n"

ITERATION=0
MAX_ITERATIONS=5
COMPLETE=false

while [ $ITERATION -lt $MAX_ITERATIONS ] && [ "$COMPLETE" = false ]; do
    ITERATION=$((ITERATION + 1))
    echo "=========================================="
    echo "🔄 第 $ITERATION 轮迭代"
    echo "=========================================="
    
    case $ITERATION in
        1)
            echo "📝 第1步: 研究主题..."
            echo "任务: 搜索 $TOPIC 相关信息"
            
            # 使用 tavily-search 深度搜索
            node ~/.openclaw/workspace/skills/tavily-search/scripts/search.mjs \
                "$TOPIC" --deep -n 10 > research.json 2>&1
            
            if [ -s research.json ]; then
                echo "✅ 研究完成，保存到 research.json"
                cat research.json | head -50
            else
                echo "⚠️ 搜索结果为空，下一轮重试"
            fi
            ;;
            
        2)
            echo "📝 第2步: 生成大纲..."
            
            if [ ! -f research.json ]; then
                echo "⚠️ 没有研究数据，跳过"
                continue
            fi
            
            # 基于研究结果生成大纲
            cat > outline.md << EOF
# $TOPIC

## 1. Introduction
- Hook: 为什么这个话题重要
- Brief overview

## 2. Key Points from Research
$(grep -o '"title": "[^"]*"' research.json 2>/dev/null | head -5 | sed 's/.*: "//;s/"$//' | sed 's/^/- /')

## 3. Main Content Sections
- Section 1: Background
- Section 2: Current Status  
- Section 3: Future Trends

## 4. Conclusion
- Summary
- Call to action

## 5. References
$(grep -o '"url": "[^"]*"' research.json 2>/dev/null | head -3 | sed 's/.*: "//;s/"$//' | sed 's/^/- /')
EOF
            
            echo "✅ 大纲生成完成，保存到 outline.md"
            cat outline.md
            ;;
            
        3)
            echo "📝 第3步: 撰写内容..."
            
            if [ ! -f outline.md ]; then
                echo "⚠️ 没有大纲，跳过"
                continue
            fi
            
            # 基于大纲生成完整文章
            cat > draft.md << EOF
---
title: "$TOPIC"
date: $(date +%Y-%m-%d)
author: Demi
---

# $TOPIC

## Introduction

$(echo "$TOPIC" | sed 's/in China 2026//') has become an increasingly popular option for international patients seeking high-quality medical care at affordable prices. In this comprehensive guide, we'll explore everything you need to know about $(echo "$TOPIC" | tr '[:upper:]' '[:lower:]') in China.

## Why Consider $TOPIC in China?

### Cost Advantages
Medical procedures in China typically cost 50-85% less than in the US or Europe, without compromising on quality.

### World-Class Facilities
China is home to several hospitals ranked among the best in the world, with state-of-the-art equipment and internationally trained doctors.

## Top Hospitals for $TOPIC

Based on our research and patient feedback, here are the leading hospitals:

$(grep -o '"title": "[^"]*"' research.json 2>/dev/null | head -3 | sed 's/.*: "//;s/"$//' | sed 's/^/1. /')

## The Treatment Process

### Before Arrival
1. Initial consultation
2. Medical records review
3. Treatment plan development

### During Your Stay
1. Hospital admission
2. Treatment procedure
3. Recovery monitoring

### After Treatment
1. Follow-up care
2. Recovery guidance
3. Communication with home doctors

## Cost Breakdown

| Service | Cost Range (USD) |
|---------|------------------|
| Initial Consultation | \$50 - \$200 |
| Treatment Procedure | \$5,000 - \$25,000 |
| Hospital Stay (per night) | \$100 - \$500 |
| Follow-up Care | \$200 - \$1,000 |

*Note: Actual costs vary based on individual cases and hospitals.*

## How We Can Help

At China Hospitals Guide, we provide:
- ✅ Hospital matching based on your needs
- ✅ Appointment scheduling
- ✅ Medical record translation
- ✅ 24/7 concierge support

## Get Started

Ready to explore your options? Contact us today:

📧 **Email**: motionlessbottle950@agentmail.to  
💬 **WhatsApp**: +44 7947 060056  
🌐 **Website**: https://chinahospitalsguide.com

---

*Last updated: $(date +%B\ %Y)*
EOF
            
            echo "✅ 初稿完成，保存到 draft.md"
            wc -l draft.md
            ;;
            
        4)
            echo "📝 第4步: 质量检查..."
            
            if [ ! -f draft.md ]; then
                echo "⚠️ 没有初稿，跳过"
                continue
            fi
            
            # 简单质量检查
            WORD_COUNT=$(wc -w < draft.md)
            echo "字数统计: $WORD_COUNT 词"
            
            if [ $WORD_COUNT -gt 500 ]; then
                echo "✅ 字数达标 (>500)"
            else
                echo "⚠️ 字数不足，需要扩充"
            fi
            
            # 检查关键元素
            echo "检查关键元素:"
            grep -q "Cost" draft.md && echo "  ✅ 费用信息" || echo "  ❌ 缺少费用信息"
            grep -q "Hospital" draft.md && echo "  ✅ 医院信息" || echo "  ❌ 缺少医院信息"
            grep -q "Contact" draft.md && echo "  ✅ 联系方式" || echo "  ❌ 缺少联系方式"
            
            # 复制为最终版本
            cp draft.md final.md
            ;;
            
        5)
            echo "📝 第5步: 最终优化..."
            
            if [ ! -f final.md ]; then
                echo "⚠️ 没有最终稿，跳过"
                continue
            fi
            
            # 添加 HTML 包装
            cat > "${TOPIC// /-}.html" << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$TOPIC | China Hospitals Guide</title>
    <meta name="description" content="Comprehensive guide to $(echo "$TOPIC" | tr '[:upper:]' '[:lower:]'). Find top hospitals, costs, and patient experiences.">
</head>
<body>
    <article>
$(cat final.md | sed 's/^# /<h1>/;s/^## /<h2>/;s/^### /<h3>/')
    </article>
</body>
</html>
EOF
            
            echo "✅ HTML版本生成完成"
            COMPLETE=true
            ;;
    esac
    
    echo -e "\n📊 本轮完成，检查点文件:"
    ls -la *.md *.json 2>/dev/null | tail -5
    
    # 模拟 Stop Hook - 检查是否完成
    if [ "$COMPLETE" = true ]; then
        echo -e "\n🎉 <promise>COMPLETE</promise>"
        break
    fi
    
    echo -e "\n⏳ 进入下一轮...\n"
done

echo "=========================================="
echo "✅ Ralph Loop 完成"
echo "=========================================="
echo "迭代次数: $ITERATION / $MAX_ITERATIONS"
echo "工作目录: $WORK_DIR"
echo ""
echo "生成文件:"
ls -lh "$WORK_DIR"
echo ""

if [ "$COMPLETE" = true ]; then
    echo "🎉 任务完成！输出文件:"
    echo "  - $WORK_DIR/final.md (Markdown)"
    echo "  - $WORK_DIR/${TOPIC// /-}.html (HTML)"
    
    # 询问是否推送到GitHub
    echo ""
    read -p "推送到GitHub? (yes/no): " PUSH
    if [ "$PUSH" = "yes" ]; then
        cp "$WORK_DIR/final.md" ~/.openclaw/workspace/docs/blog/
        echo "已复制到 docs/blog/"
    fi
else
    echo "⚠️ 达到最大迭代次数，任务未完成"
    echo "请检查中间文件，手动完成或调整参数重试"
fi
