---
theme: scholarly
title: Aurora Product Demo
info: |
  一个用于展示多 slide 部署的简短示例。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Aurora Launch Deck

同一个仓库，同时部署第二套 Slidev 演示稿。

<div class="pt-6 text-sm opacity-70">
  GitHub Pages 路径：<code>/demo/</code>
</div>

---
layout: section
---

# Why This Demo Exists

- 验证一个仓库可并行部署多套 slide
- 展示每套 slide 都有独立访问路径
- 保留共享组件、依赖和 CI/CD 流程

---
layout: center
---

# Release Flow

```mermaid
graph LR
  A[Open PR to main] --> B[Build all decks]
  B --> C[Merge PR]
  C --> D[Deploy dist to GitHub Pages]
  D --> E[/academic and /demo available/]
```

---
layout: default
---

## Launch Metrics

| Metric | Value | Note |
| --- | ---: | --- |
| Build targets | 2 | `academic`, `demo` |
| Repository | 1 | Shared CI/CD |
| Deploy trigger | Merge to `main` | Only after review |

---
layout: end
---

# Thank You

未来只要继续往清单里追加 entry，就可以扩展到更多 slide。
