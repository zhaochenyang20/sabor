---
template: overrides/main.html
title: insiders
---

# issue
- 不合乎 issue 规范则成员扣分 `0.5`
- 3 天内无 issue 扣分
- 一个 issue 做了 7 天以上扣分

# commit
- 不合乎 issue 规范则成员扣分 `0.1`
- 修改超过 500 行扣分
- message 少于 20 字符扣分 `0.5`
- 没有关联的任务(issue)扣分 `0.2`
- 两次提交间隔 3 天扣分

# Branch 与 Merge
- 直接修改 master(除非 revert)扣分 **`5`**
- merge request信息没有遵守规范扣分 `0.5`
- master 出 bug，通过 git revert 回到历史版本扣分 **`1`**
- 分支没有语义扣分 `0.5`
- 已完成功能或者修复 bug 的分支没有删除扣分 `0.5`
- 合并了自己未参与修改的分支扣分 **`1`**
- Merge Request 没有非提出者检查扣分 **`1`**

# 测试
- 待定

# 平稳运行
- CI/CD 搭建完成后，HTTP 访问错误扣分
- CI/CD 搭建完成后，发现功能消失扣分
- 部署系统出现交互/逻辑错误扣分
- 删库扣分 **`3`**