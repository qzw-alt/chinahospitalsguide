#!/bin/bash
# Memory Manager - 记忆管理脚本

MEMORY_DIR="$HOME/.openclaw/workspace/memory"
TODAY=$(date +%Y-%m-%d)

# 确保目录存在
mkdir -p "$MEMORY_DIR"/{hot,warm,cold}

# 读取当前记忆状态
memory_read() {
    echo "=== 🔥 HOT MEMORY (活跃任务) ==="
    if [ -f "$MEMORY_DIR/hot/HOT_MEMORY.md" ]; then
        cat "$MEMORY_DIR/hot/HOT_MEMORY.md"
    else
        echo "(空)"
    fi
    
    echo -e "\n=== 🌡️ WARM MEMORY (稳定配置) ==="
    if [ -f "$MEMORY_DIR/warm/WARM_MEMORY.md" ]; then
        cat "$MEMORY_DIR/warm/WARM_MEMORY.md"
    else
        echo "(空)"
    fi
    
    echo -e "\n=== 📅 今日日志 ($TODAY) ==="
    if [ -f "$MEMORY_DIR/$TODAY.md" ]; then
        cat "$MEMORY_DIR/$TODAY.md"
    else
        echo "(空)"
    fi
}

# 写入记忆
memory_write() {
    local content="$1"
    local type="${2:-general}"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # 写入今日日志
    echo -e "\n## $timestamp [$type]\n$content" >> "$MEMORY_DIR/$TODAY.md"
    
    # 根据类型写入不同层级
    case "$type" in
        decision|preference)
            echo -e "\n- **$timestamp**: $content" >> "$MEMORY_DIR/warm/WARM_MEMORY.md"
            ;;
        error|lesson)
            echo -e "\n- **$timestamp**: $content" >> "$MEMORY_DIR/hot/HOT_MEMORY.md"
            ;;
    esac
    
    echo "✅ 已记录到记忆系统"
}

# 搜索记忆
memory_search() {
    local keyword="$1"
    echo "=== 搜索: $keyword ==="
    
    # 搜索所有markdown文件
    find "$MEMORY_DIR" -name "*.md" -exec grep -l "$keyword" {} \; 2>/dev/null | while read file; do
        echo -e "\n📄 $(basename $file):"
        grep -n "$keyword" "$file" | head -5
    done
}

# 归档今日任务
memory_archive() {
    local yesterday=$(date -d "yesterday" +%Y-%m-%d 2>/dev/null || date -v-1d +%Y-%m-%d)
    
    # 将昨日日志移到cold
    if [ -f "$MEMORY_DIR/$yesterday.md" ]; then
        mv "$MEMORY_DIR/$yesterday.md" "$MEMORY_DIR/cold/"
        echo "✅ 已归档 $yesterday.md"
    fi
    
    # 清理HOT中已完成的任务
    echo "📝 请检查HOT_MEMORY.md，删除已完成任务"
}

# 主入口
case "$1" in
    read)
        memory_read
        ;;
    write)
        memory_write "$2" "$3"
        ;;
    search)
        memory_search "$2"
        ;;
    archive)
        memory_archive
        ;;
    *)
        echo "用法: memory-manager [read|write|search|archive]"
        echo "  read                    - 读取当前记忆状态"
        echo "  write '内容' [type]     - 写入记忆 (type: decision/preference/error/lesson/general)"
        echo "  search '关键词'          - 搜索记忆"
        echo "  archive                 - 归档昨日任务"
        ;;
esac
