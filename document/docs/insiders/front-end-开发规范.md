---
template: overrides/main.html
title: insiders
---

# Issue

- 每次提出 issue 前，先组内讨论

## 语义约定
- 将 IR 拆解为 SR
- IR 的拆解由前后端商讨决定

### IR 为原始需求
- IR 为用户提出的需求，在粒度上不严格定义大小
- IR 有不重复的编号，三位十进制数字，从 001 开始

### SR 为功能需求
- SR 要求具有可测试性，粒度不应过细
- SR 有不重复的编号，三位十进制数字，从 001 开始
- Enhencement 对于之前的 SR 功能进行的任务新建为新的 issue，并在原来的 issue 末尾写明

### INT 为配置需求
- 各项配置与项目初始化并非原始需求
- 并非原始需求列表所列出的项目的分解使用编号 INT + 三位十进制数字，从 001 开始
- 其中`INT.001-INT.006`按照例会纪要所列执行


### BUG 为 bugfix
- 类似于 INT，直接编号
- 例如 BUG.001

### Other 为难以准确描述的任务
- 难以描述的任务使用编号 OTH + 三位十进制数字，从 001 开始

## 示例
- Title: SR.001.001 绘制链接曲线
- Content: 为需求跟进图绘制链接曲线，具体样式参考附录文件

# Branch

## 语义约定
- 参考前文所写 Issue 规范，每个 branch 命名为相应的 Issue 编号(SR / INT) /简要功能说明
- 每次写代码先 pull 最新的代码，然后为新功能开辟新分支
- 分支需求完成并测试，及时合并进入 dev，在 dev 上测试通过，最后删除分支

## 示例
```
> git checkout -b INT.001/init_react
> git checkout -b OTH.024/refix_readme
> git checkout -b BUG.001/fix_front_page
```

# Commit 规范

## 语义约定
- 参考参考前文所写 Issue 规范，每个 commit 命名为相应的 Issue 编号(SR / INT) + #(issue 编号) + 简要说明
- commit 不可粒度太大，建议每 200 行内 commit 一次
- 每一个 commit 都需要遵守语义信息，并且在 issue 里指出 commit 的 stage 与简要说明

## 示例
```
git commit -m "INT.001 (#1): use npm to init react"
git commit -m "SR.012.002 (#67): add logical component"
```

# Merge Request 规范

## 语义约定
- 参考前文所写 Issue 规范，每个 merge request 命名为相应的 Issue 编号(SR / INT) + #( issue 编号) + 详细功能说明（合计超过 20 字符）多个SR用; 隔开。当SR数目超出gitlab规定时，选取较为重要的内容写入。

## 注意事项
- dev 确保无误后并入 master 并部署至服务器

- 在 push 之前，本地运行 CI/CD
> 1. npm run lint // 检查风格
> 2. npm run build // 检查编译
> 3. npm run test // 单元测试
> 4. 如果风格有问题，可以 `eslint <filePath> --fix`

- master 分支已开启保护，需要手动在 gitlab 合并
- 将 dev 合并进入 master 后，请保留 dev 分支
- 特别地，在 GitLab 上合并的 MR，只需在 MR 申请页填写上述信息，系统自动生成的 `Merge branch 'some-branch' into 'another-branch'` 可以保留。

## 示例
```bash
 git merge SR.xxx.yyy/... --no-ff -m "SR.001.002 (#102): CI/CD config, ESLint config"
 git push
```
表示本次合并的代码实现了需求 SR.001.002，将 dev 合并入 master,在 issue 列表里的序号为第 102 号 issue，完成了配置 CI/CD 和 ESLint 这一工作

# 工作流程
- 分解需求后，将 SR 写入 wiki，然后在 gitlab 的 issue 里提出
- 编写功能时，及时补写 stage 信息
- 完成功能后，将 issue close 掉
- 如需 bugfix 或者 enhance 某个功能，则在原功能 issue 尾部进行说明

# 例会文档
- 前后端文档由前端三人组交替完成
- 每周例会前必须完成例会文档(参考 wiki 例会文档部分)，并在组内讨论